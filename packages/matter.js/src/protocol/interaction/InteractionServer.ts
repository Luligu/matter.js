/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatterDevice } from "../../MatterDevice.js";
import { TlvNoResponse } from "../../cluster/Cluster.js";
import {
    AnyAttributeServer,
    AttributeServer,
    FabricScopedAttributeServer,
} from "../../cluster/server/AttributeServer.js";
import { CommandServer } from "../../cluster/server/CommandServer.js";
import { EventServer } from "../../cluster/server/EventServer.js";
import { Message, SessionType } from "../../codec/MessageCodec.js";
import { InternalError, MatterFlowError } from "../../common/MatterError.js";
import { tryCatch, tryCatchAsync } from "../../common/TryCatchHandler.js";
import { ValidationError } from "../../common/ValidationError.js";
import { Crypto } from "../../crypto/Crypto.js";
import { AttributeId } from "../../datatype/AttributeId.js";
import { ClusterId } from "../../datatype/ClusterId.js";
import { CommandId } from "../../datatype/CommandId.js";
import { EndpointNumber } from "../../datatype/EndpointNumber.js";
import { EventId } from "../../datatype/EventId.js";
import { EventNumber } from "../../datatype/EventNumber.js";
import { NodeId } from "../../datatype/NodeId.js";
import { EndpointInterface } from "../../endpoint/EndpointInterface.js";
import { Diagnostic } from "../../log/Diagnostic.js";
import { Logger } from "../../log/Logger.js";
import { Specification } from "../../model/definitions/Specification.js";
import { GLOBAL_IDS } from "../../model/index.js";
import { MessageExchange } from "../../protocol/MessageExchange.js";
import { ProtocolHandler } from "../../protocol/ProtocolHandler.js";
import { EventHandler } from "../../protocol/interaction/EventHandler.js";
import { NoAssociatedFabricError, SecureSession, assertSecureSession } from "../../session/SecureSession.js";
import { ArraySchema } from "../../tlv/TlvArray.js";
import { TlvNoArguments } from "../../tlv/TlvNoArguments.js";
import { TypeFromSchema } from "../../tlv/TlvSchema.js";
import {
    decodeAttributeValueWithSchema,
    decodeListAttributeValueWithSchema,
    expandPathsInAttributeData,
} from "./AttributeDataDecoder.js";
import {
    AttributeReportPayload,
    DataReportPayload,
    EventDataPayload,
    EventReportPayload,
} from "./AttributeDataEncoder.js";
import { InteractionEndpointStructure } from "./InteractionEndpointStructure.js";
import {
    InteractionRecipient,
    InteractionServerMessenger,
    InvokeRequest,
    InvokeResponse,
    MessageType,
    ReadRequest,
    SubscribeRequest,
    TimedRequest,
    WriteRequest,
    WriteResponse,
} from "./InteractionMessenger.js";
import {
    TlvAttributePath,
    TlvClusterPath,
    TlvCommandPath,
    TlvEventFilter,
    TlvEventPath,
    TlvInvokeResponseData,
    TlvSubscribeResponse,
} from "./InteractionProtocol.js";
import { StatusCode, StatusResponseError } from "./StatusCode.js";
import { SubscriptionHandler } from "./SubscriptionHandler.js";
import { SubscriptionOptions } from "./SubscriptionOptions.js";

/** Protocol ID for the Interaction Protocol as per Matter specification. */
export const INTERACTION_PROTOCOL_ID = 0x0001;

/** Backward compatible re-export for Interaction Model version we support currently. */
export const INTERACTION_MODEL_REVISION = Specification.INTERACTION_MODEL_REVISION;

/** Number of Invoke Path setting from our Interaction model implementation. */
export const MAX_PATHS_PER_INVOKE = 1;

const logger = Logger.get("InteractionServer");

export interface CommandPath {
    nodeId?: NodeId;
    endpointId: EndpointNumber;
    clusterId: ClusterId;
    commandId: CommandId;
}

export interface AttributePath {
    nodeId?: NodeId;
    endpointId: EndpointNumber;
    clusterId: ClusterId;
    attributeId: AttributeId;
}

export interface EventPath {
    nodeId?: NodeId;
    endpointId: EndpointNumber;
    clusterId: ClusterId;
    eventId: EventId;
}

export interface AttributeWithPath {
    path: AttributePath;
    attribute: AnyAttributeServer<any>;
}

export interface EventWithPath {
    path: EventPath;
    event: EventServer<any, any>;
}

export interface CommandWithPath {
    path: CommandPath;
    command: CommandServer<any, any>;
}

export function genericElementPathToId(
    endpointId: EndpointNumber | undefined,
    clusterId: ClusterId | undefined,
    elementId: number | undefined,
) {
    return `${endpointId}/${clusterId}/${elementId}`;
}

export function commandPathToId({ endpointId, clusterId, commandId }: CommandPath) {
    return genericElementPathToId(endpointId, clusterId, commandId);
}

export function attributePathToId({ endpointId, clusterId, attributeId }: TypeFromSchema<typeof TlvAttributePath>) {
    return genericElementPathToId(endpointId, clusterId, attributeId);
}

export function eventPathToId({ endpointId, clusterId, eventId }: TypeFromSchema<typeof TlvEventPath>) {
    return genericElementPathToId(endpointId, clusterId, eventId);
}

export function clusterPathToId({ nodeId, endpointId, clusterId }: TypeFromSchema<typeof TlvClusterPath>) {
    return `${nodeId}/${endpointId}/${clusterId}`;
}

function isConcreteAttributePath(
    path: TypeFromSchema<typeof TlvAttributePath>,
): path is TypeFromSchema<typeof TlvAttributePath> & AttributePath {
    const { endpointId, clusterId, attributeId } = path;
    return endpointId !== undefined && clusterId !== undefined && attributeId !== undefined;
}

export function validateReadAttributesPath(path: TypeFromSchema<typeof TlvAttributePath>, isGroupSession = false) {
    if (isGroupSession) {
        throw new StatusResponseError("Illegal read request with group session", StatusCode.InvalidAction);
    }
    const { clusterId, attributeId } = path;
    if (clusterId === undefined && attributeId !== undefined) {
        if (!GLOBAL_IDS.has(attributeId)) {
            throw new StatusResponseError(
                `Illegal read request for wildcard cluster and non global attribute ${attributeId}`,
                StatusCode.InvalidAction,
            );
        }
    }
}

function validateWriteAttributesPath(path: TypeFromSchema<typeof TlvAttributePath>, isGroupSession = false) {
    const { endpointId, clusterId, attributeId } = path;
    if (clusterId === undefined || attributeId === undefined) {
        throw new StatusResponseError(
            "Illegal write request with wildcard cluster or attribute ID",
            StatusCode.InvalidAction,
        );
    }
    if (isGroupSession && endpointId !== undefined) {
        throw new StatusResponseError("Illegal write request with group ID and endpoint ID", StatusCode.InvalidAction);
    }
}

function isConcreteEventPath(
    path: TypeFromSchema<typeof TlvEventPath>,
): path is TypeFromSchema<typeof TlvEventPath> & EventPath {
    const { endpointId, clusterId, eventId } = path;
    return endpointId !== undefined && clusterId !== undefined && eventId !== undefined;
}

export function validateReadEventPath(path: TypeFromSchema<typeof TlvEventPath>, isGroupSession = false) {
    const { clusterId, eventId } = path;
    if (clusterId === undefined && eventId !== undefined) {
        throw new StatusResponseError("Illegal read request with wildcard cluster ID", StatusCode.InvalidAction);
    }
    if (isGroupSession) {
        throw new StatusResponseError("Illegal read request with group session", StatusCode.InvalidAction);
    }
}

function isConcreteCommandPath(
    path: TypeFromSchema<typeof TlvCommandPath>,
): path is TypeFromSchema<typeof TlvCommandPath> & CommandPath {
    const { endpointId, clusterId, commandId } = path;
    return endpointId !== undefined && clusterId !== undefined && commandId !== undefined;
}

function validateCommandPath(path: TypeFromSchema<typeof TlvCommandPath>, isGroupSession = false) {
    const { endpointId, clusterId, commandId } = path;
    if (clusterId === undefined || commandId === undefined) {
        throw new StatusResponseError(
            "Illegal write request with wildcard cluster or attribute ID",
            StatusCode.InvalidAction,
        );
    }
    if (isGroupSession && endpointId !== undefined) {
        throw new StatusResponseError("Illegal write request with group ID and endpoint ID", StatusCode.InvalidAction);
    }
}

/**
 * Translates interactions from the Matter protocol to Matter.js APIs.
 */
export class InteractionServer implements ProtocolHandler<MatterDevice>, InteractionRecipient {
    #endpointStructure;
    #nextSubscriptionId = Crypto.getRandomUInt32();
    readonly #subscriptionMap = new Map<number, SubscriptionHandler>();
    #isClosing = false;
    #subscriptionConfig: SubscriptionOptions.Configuration;
    #eventHandler: EventHandler;

    constructor({ subscriptionOptions, eventHandler, endpointStructure }: InteractionServer.Configuration) {
        this.#subscriptionConfig = SubscriptionOptions.configurationFor(subscriptionOptions);
        this.#eventHandler = eventHandler;
        this.#endpointStructure = endpointStructure;

        this.#endpointStructure.change.on(() => {
            for (const subscription of this.#subscriptionMap.values()) {
                subscription.updateSubscription();
            }
        });
    }

    getId() {
        return INTERACTION_PROTOCOL_ID;
    }

    protected get isClosing() {
        return this.#isClosing;
    }

    async onNewExchange(exchange: MessageExchange<MatterDevice>) {
        // Note - changes here must be copied to TransactionalInteractionServer as it does not call super() to avoid
        // the stack frame
        if (this.#isClosing) return; // We are closing, ignore anything newly incoming
        await new InteractionServerMessenger(exchange).handleRequest(this);
    }

    async handleReadRequest(
        exchange: MessageExchange<MatterDevice>,
        {
            attributeRequests,
            dataVersionFilters,
            eventRequests,
            eventFilters,
            isFabricFiltered,
            interactionModelRevision,
        }: ReadRequest,
        message: Message,
    ): Promise<DataReportPayload> {
        logger.debug(
            `Received read request from ${exchange.channel.name}: attributes:${
                attributeRequests?.map(path => this.#endpointStructure.resolveAttributeName(path)).join(", ") ?? "none"
            }, events:${
                eventRequests?.map(path => this.#endpointStructure.resolveEventName(path)).join(", ") ?? "none"
            } isFabricFiltered=${isFabricFiltered}`,
        );

        if (interactionModelRevision > INTERACTION_MODEL_REVISION) {
            logger.debug(
                `Interaction model revision of sender ${interactionModelRevision} is higher than supported ${INTERACTION_MODEL_REVISION}.`,
            );
        }
        if (attributeRequests === undefined && eventRequests === undefined) {
            throw new StatusResponseError(
                "Only Read requests with attributeRequests or eventRequests are supported right now",
                StatusCode.UnsupportedRead,
            );
        }

        if (message.packetHeader.sessionType !== SessionType.Unicast) {
            throw new StatusResponseError(
                "Subscriptions are only allowed on unicast sessions",
                StatusCode.InvalidAction,
            );
        }

        const dataVersionFilterMap = new Map<string, number>(
            dataVersionFilters?.map(({ path, dataVersion }) => [clusterPathToId(path), dataVersion]) ?? [],
        );
        if (dataVersionFilterMap.size > 0) {
            logger.debug(
                `DataVersionFilters: ${Array.from(dataVersionFilterMap.entries())
                    .map(([path, version]) => `${path}=${version}`)
                    .join(", ")}`,
            );
        }

        const attributeReportsPayload = new Array<AttributeReportPayload>();
        for (const requestPath of attributeRequests ?? []) {
            validateReadAttributesPath(requestPath);

            const attributes = this.#endpointStructure.getAttributes([requestPath]);

            // Requested attribute path not found in any cluster server on any endpoint
            if (attributes.length === 0) {
                // TODO Add checks for nodeId -> UnknownNode
                if (!isConcreteAttributePath(requestPath)) {
                    // Wildcard path and we do not know any of the attributes: Ignore the error
                    logger.debug(
                        `Read from ${exchange.channel.name}: ${this.#endpointStructure.resolveAttributeName(
                            requestPath,
                        )}: ${this.#endpointStructure.resolveAttributeName(requestPath)}: ignore non-existing attribute`,
                    );
                } else {
                    const { endpointId, clusterId, attributeId } = requestPath;
                    // Concrete path, but still unknown for us, so generate the right error status
                    tryCatch(
                        () => {
                            this.#endpointStructure.validateConcreteAttributePath(endpointId, clusterId, attributeId);
                            throw new InternalError(
                                "validateConcreteAttributePath should throw StatusResponseError but did not.",
                            );
                        },
                        StatusResponseError,
                        error => {
                            logger.debug(
                                `Error reading attribute from ${
                                    exchange.channel.name
                                }: ${this.#endpointStructure.resolveAttributeName(requestPath)}: unsupported path: Status=${
                                    error.code
                                }`,
                            );
                            attributeReportsPayload.push({
                                attributeStatus: { path: requestPath, status: { status: error.code } },
                            });
                        },
                    );
                }
                continue;
            }

            // Process all known attributes for the given path
            for (const { path, attribute } of attributes) {
                const { nodeId, endpointId, clusterId } = path;

                try {
                    const { value, version } = await tryCatchAsync(
                        async () =>
                            this.readAttribute(
                                path,
                                attribute,
                                exchange,
                                isFabricFiltered,
                                message,
                                this.#endpointStructure.getEndpoint(endpointId)!,
                            ),
                        NoAssociatedFabricError,
                        async () => {
                            // TODO: Remove when we remove legacy API
                            //  This is not fully correct but should be sufficient for now
                            //  This is fixed in the new API already, so this error should never throw
                            //  Fabric scoped attributes are access errors, fabric sensitive attributes are just filtered
                            //  Assume for now that in this place we only need to handle fabric sensitive case
                            if (endpointId === undefined || clusterId === undefined) {
                                throw new MatterFlowError("Should never happen");
                            }
                            const cluster = this.#endpointStructure.getClusterServer(endpointId, clusterId);
                            if (cluster === undefined || cluster.datasource == undefined) {
                                throw new MatterFlowError("Should never happen");
                            }
                            return {
                                version: cluster.datasource.version,
                                value: [],
                            };
                        },
                    );

                    const versionFilterValue =
                        endpointId !== undefined && clusterId !== undefined
                            ? dataVersionFilterMap.get(clusterPathToId({ nodeId, endpointId, clusterId }))
                            : undefined;
                    if (versionFilterValue !== undefined && versionFilterValue === version) {
                        logger.debug(
                            `Read attribute from ${exchange.channel.name}: ${this.#endpointStructure.resolveAttributeName(
                                path,
                            )}=${Logger.toJSON(value)} (version=${version}) ignored because of dataVersionFilter`,
                        );
                        continue;
                    }

                    logger.debug(
                        `Read attribute from ${exchange.channel.name}: ${this.#endpointStructure.resolveAttributeName(
                            path,
                        )}=${Logger.toJSON(value)} (version=${version})`,
                    );

                    const { schema } = attribute;
                    attributeReportsPayload.push({
                        attributeData: { path, dataVersion: version, payload: value, schema },
                    });
                } catch (error) {
                    logger.error(
                        `Error while reading attribute from ${
                            exchange.channel.name
                        } to ${this.#endpointStructure.resolveAttributeName(path)}:`,
                        error,
                    );
                    if (error instanceof StatusResponseError) {
                        // Add StatusResponseErrors, but only when the initial path was concrete, else error are ignored
                        if (isConcreteAttributePath(requestPath)) {
                            attributeReportsPayload.push({ attributeStatus: { path, status: { status: error.code } } });
                        }
                    } else {
                        throw error;
                    }
                }
            }
        }

        let eventReportsPayload: undefined | EventReportPayload[];
        if (eventRequests) {
            eventReportsPayload = [];
            for (const requestPath of eventRequests) {
                validateReadEventPath(requestPath);

                const events = this.#endpointStructure.getEvents([requestPath]);

                // Requested event path not found in any cluster server on any endpoint
                if (events.length === 0) {
                    // TODO Add checks for nodeId
                    if (!isConcreteEventPath(requestPath)) {
                        // Wildcard path: Just leave out values
                        logger.debug(
                            `Read event from ${exchange.channel.name}: ${this.#endpointStructure.resolveEventName(
                                requestPath,
                            )}: ignore non-existing event`,
                        );
                    } else {
                        const { endpointId, clusterId, eventId } = requestPath;
                        tryCatch(
                            () => {
                                this.#endpointStructure.validateConcreteEventPath(endpointId, clusterId, eventId);
                                throw new InternalError(
                                    "validateConcreteEventPath should throw StatusResponseError but did not.",
                                );
                            },
                            StatusResponseError,
                            error => {
                                logger.debug(
                                    `Read event from ${
                                        exchange.channel.name
                                    }: ${this.#endpointStructure.resolveEventName(requestPath)}: unsupported path: Status=${
                                        error.code
                                    }`,
                                );
                                eventReportsPayload?.push({
                                    eventStatus: { path: requestPath, status: { status: error.code } },
                                });
                            },
                        );
                    }
                    continue;
                }

                const reportsForPath = new Array<{ eventData: EventDataPayload }>();
                for (const { path, event } of events) {
                    try {
                        const { endpointId } = path;
                        const matchingEvents = await this.readEvent(
                            path,
                            eventFilters,
                            event,
                            exchange,
                            isFabricFiltered,
                            message,
                            this.#endpointStructure.getEndpoint(endpointId)!,
                        );
                        logger.debug(
                            `Read event from ${exchange.channel.name}: ${this.#endpointStructure.resolveEventName(
                                path,
                            )}=${Logger.toJSON(matchingEvents)}`,
                        );
                        const { schema } = event;
                        reportsForPath.push(
                            ...matchingEvents.map(({ eventNumber, priority, epochTimestamp, data }) => ({
                                eventData: {
                                    path,
                                    eventNumber,
                                    priority,
                                    epochTimestamp,
                                    payload: data,
                                    schema,
                                },
                            })),
                        );
                    } catch (error) {
                        logger.error(
                            `Error while reading event from ${
                                exchange.channel.name
                            } to ${this.#endpointStructure.resolveEventName(path)}:`,
                            error,
                        );
                        if (error instanceof StatusResponseError) {
                            // Add StatusResponseErrors, but only when the initial path was concrete, else error are ignored
                            if (isConcreteEventPath(requestPath)) {
                                eventReportsPayload?.push({ eventStatus: { path, status: { status: error.code } } });
                            }
                        } else {
                            throw error;
                        }
                    }
                }
                eventReportsPayload.push(
                    ...reportsForPath.sort((a, b) => {
                        const eventNumberA = a.eventData?.eventNumber ?? EventNumber(0);
                        const eventNumberB = b.eventData?.eventNumber ?? EventNumber(0);
                        if (eventNumberA > eventNumberB) {
                            return 1;
                        } else if (eventNumberA < eventNumberB) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }),
                );
            }
        }

        // TODO support suppressResponse for responses
        return {
            interactionModelRevision: INTERACTION_MODEL_REVISION,
            suppressResponse: false,
            attributeReportsPayload, // TODO Return compressed response once https://github.com/project-chip/connectedhomeip/issues/29359 is solved
            eventReportsPayload,
        };
    }

    protected async readAttribute(
        _path: AttributePath,
        attribute: AnyAttributeServer<any>,
        exchange: MessageExchange<MatterDevice>,
        isFabricFiltered: boolean,
        message: Message,
        _endpoint: EndpointInterface,
    ) {
        return attribute.getWithVersion(exchange.session, isFabricFiltered, message);
    }

    protected async readEvent(
        _path: EventPath,
        eventFilters: TypeFromSchema<typeof TlvEventFilter>[] | undefined,
        event: EventServer<any, any>,
        exchange: MessageExchange<MatterDevice>,
        isFabricFiltered: boolean,
        message: Message,
        _endpoint: EndpointInterface,
    ) {
        return event.get(exchange.session, isFabricFiltered, message, eventFilters);
    }

    async handleWriteRequest(
        exchange: MessageExchange<MatterDevice>,
        { suppressResponse, timedRequest, writeRequests, interactionModelRevision, moreChunkedMessages }: WriteRequest,
        message: Message,
    ): Promise<WriteResponse> {
        const sessionType = message.packetHeader.sessionType;
        logger.debug(
            `Received write request from ${exchange.channel.name}: ${writeRequests
                .map(req => this.#endpointStructure.resolveAttributeName(req.path))
                .join(", ")}, suppressResponse=${suppressResponse}, moreChunkedMessages=${moreChunkedMessages}`,
        );

        if (moreChunkedMessages && suppressResponse) {
            throw new StatusResponseError(
                "MoreChunkedMessages and SuppressResponse cannot be used together in write messages",
                StatusCode.InvalidAction,
            );
        }

        if (interactionModelRevision > INTERACTION_MODEL_REVISION) {
            logger.debug(
                `Interaction model revision of sender ${interactionModelRevision} is higher than supported ${INTERACTION_MODEL_REVISION}.`,
            );
        }

        const receivedWithinTimedInteraction = exchange.hasActiveTimedInteraction();

        if (receivedWithinTimedInteraction && moreChunkedMessages) {
            throw new StatusResponseError(
                "Write Request action that is part of a Timed Write Interaction SHALL NOT be chunked.",
                StatusCode.InvalidAction,
            );
        }

        if (exchange.hasExpiredTimedInteraction()) {
            exchange.clearTimedInteraction(); // ??
            throw new StatusResponseError(`Timed request window expired. Decline write request.`, StatusCode.Timeout);
        }

        if (timedRequest !== exchange.hasTimedInteraction()) {
            throw new StatusResponseError(
                `timedRequest flag of write interaction (${timedRequest}) mismatch with expected timed interaction (${receivedWithinTimedInteraction}).`,
                StatusCode.TimedRequestMismatch,
            );
        }

        if (receivedWithinTimedInteraction) {
            logger.debug(`Write request from ${exchange.channel.name} received while timed interaction is running.`);
            exchange.clearTimedInteraction();
            if (sessionType !== SessionType.Unicast) {
                throw new StatusResponseError(
                    "Write requests are only allowed on unicast sessions when a timed interaction is running.",
                    StatusCode.InvalidAction,
                ); // ???
            }
        }

        if (sessionType === SessionType.Group && !suppressResponse) {
            throw new StatusResponseError(
                "Write requests are only allowed as group casts when suppressResponse=true.",
                StatusCode.InvalidAction,
            ); // ???
        }

        const writeData = expandPathsInAttributeData(writeRequests, true);

        const writeResults = new Array<{
            path: TypeFromSchema<typeof TlvAttributePath>;
            statusCode: StatusCode;
            clusterStatusCode?: number;
        }>();
        const attributeListWrites = new Set<AttributeServer<any>>();
        const clusterDataVersionInfo = new Map<string, number>();
        const inaccessiblePaths = new Set<string>();

        // TODO Add handling for moreChunkedMessages here when adopting for Matter 1.3

        for (const writeRequest of writeData) {
            const { path: writePath, dataVersion } = writeRequest;
            const { listIndex } = writePath;

            validateWriteAttributesPath(writePath);

            const attributes = this.#endpointStructure.getAttributes([writePath], true);

            // No existing attribute matches the given path and is writable
            if (attributes.length === 0) {
                // TODO: Also check nodeId
                if (!isConcreteAttributePath(writePath)) {
                    // Wildcard path: Just ignore
                    logger.debug(
                        `Write from ${exchange.channel.name}: ${this.#endpointStructure.resolveAttributeName(
                            writePath,
                        )}: ignore non-existing (wildcard) attribute`,
                    );
                } else {
                    const { endpointId, clusterId, attributeId } = writePath;

                    // was a concrete path
                    tryCatch(
                        () => {
                            if (
                                this.#endpointStructure.validateConcreteAttributePath(
                                    endpointId,
                                    clusterId,
                                    attributeId,
                                )
                            ) {
                                throw new StatusResponseError(
                                    `Attribute ${attributeId} is not writable.`,
                                    StatusCode.UnsupportedWrite,
                                );
                            }
                            throw new InternalError(
                                "validateConcreteAttributePath check should throw StatusResponseError but did not.",
                            );
                        },
                        StatusResponseError,
                        error => {
                            logger.debug(
                                `Write from ${exchange.channel.name}: ${this.#endpointStructure.resolveAttributeName(
                                    writePath,
                                )} not allowed: Status=${error.code}`,
                            );
                            writeResults.push({ path: writePath, statusCode: error.code });
                        },
                    );
                }
                continue;
            }

            // Concrete path and found and writable
            if (attributes.length === 1 && isConcreteAttributePath(writePath)) {
                const { endpointId, clusterId } = writePath;
                const { attribute } = attributes[0];

                if (attribute.requiresTimedInteraction && !receivedWithinTimedInteraction) {
                    logger.debug(`This write requires a timed interaction which is not initialized.`);
                    writeResults.push({ path: writePath, statusCode: StatusCode.NeedsTimedInteraction });
                    continue;
                }

                if (
                    attribute instanceof FabricScopedAttributeServer &&
                    (!exchange.session.isSecure || !(exchange.session as SecureSession<MatterDevice>).fabric)
                ) {
                    logger.debug(`This write requires a secure session with a fabric assigned which is missing.`);
                    writeResults.push({ path: writePath, statusCode: StatusCode.UnsupportedAccess });
                    continue;
                }

                // Check the provided dataVersion with the dataVersion of the cluster
                // And remember this initial dataVersion for all checks inside this write transaction to allow proper
                // processing of chunked lists
                if (dataVersion !== undefined) {
                    const datasource = this.#endpointStructure.getClusterServer(endpointId, clusterId)?.datasource;
                    const { nodeId } = writePath;
                    const clusterKey = clusterPathToId({ nodeId, endpointId, clusterId });
                    const currentDataVersion = clusterDataVersionInfo.get(clusterKey) ?? datasource?.version;

                    if (currentDataVersion !== undefined) {
                        if (dataVersion !== currentDataVersion) {
                            logger.debug(
                                `This write requires a specific data version (${dataVersion}) which do not match the current cluster data version (${currentDataVersion}).`,
                            );
                            writeResults.push({ path: writePath, statusCode: StatusCode.DataVersionMismatch });
                            continue;
                        }
                        clusterDataVersionInfo.set(clusterKey, currentDataVersion);
                    }
                }
            }

            for (const { path, attribute } of attributes) {
                const { schema, defaultValue } = attribute;
                const pathId = attributePathToId(path);

                try {
                    if (
                        !(attribute instanceof AttributeServer) &&
                        !(attribute instanceof FabricScopedAttributeServer)
                    ) {
                        throw new StatusResponseError(
                            "Fixed attributes cannot be written",
                            StatusCode.UnsupportedWrite,
                        );
                    }

                    if (inaccessiblePaths.has(pathId)) {
                        logger.debug(`This write is not allowed due to previous access denied.`);
                        continue;
                    }

                    const { endpointId } = path;
                    const value =
                        listIndex === undefined
                            ? decodeAttributeValueWithSchema(schema, [writeRequest], defaultValue)
                            : decodeListAttributeValueWithSchema(
                                  schema,
                                  [writeRequest],
                                  (
                                      await this.readAttribute(
                                          path,
                                          attribute,
                                          exchange,
                                          true,
                                          message,
                                          this.#endpointStructure.getEndpoint(endpointId)!,
                                      )
                                  ).value ?? defaultValue,
                              );
                    logger.debug(
                        `Handle write request from ${
                            exchange.channel.name
                        } resolved to: ${this.#endpointStructure.resolveAttributeName(path)}=${Logger.toJSON(
                            value,
                        )} (listIndex=${listIndex}, for-version=${dataVersion})`,
                    );

                    if (attribute.requiresTimedInteraction && !receivedWithinTimedInteraction) {
                        logger.debug(`This write requires a timed interaction which is not initialized.`);
                        throw new StatusResponseError(
                            "This write requires a timed interaction which is not initialized.",
                            StatusCode.NeedsTimedInteraction,
                        );
                    }

                    await this.writeAttribute(
                        path,
                        attribute,
                        value,
                        exchange,
                        message,
                        this.#endpointStructure.getEndpoint(endpointId)!,
                        receivedWithinTimedInteraction,
                        schema instanceof ArraySchema,
                    );
                    if (schema instanceof ArraySchema && !attributeListWrites.has(attribute)) {
                        attributeListWrites.add(attribute);
                    }
                } catch (error: any) {
                    if (error instanceof StatusResponseError && error.code === StatusCode.UnsupportedAccess) {
                        inaccessiblePaths.add(pathId);
                    }
                    if (attributes.length === 1 && isConcreteAttributePath(writePath)) {
                        // For Multi-Attribute-Writes we ignore errors
                        logger.error(
                            `Error while handling write request from ${
                                exchange.channel.name
                            } to ${this.#endpointStructure.resolveAttributeName(path)}:`,
                            error instanceof StatusResponseError ? error.message : error,
                        );
                        if (error instanceof StatusResponseError) {
                            writeResults.push({ path, statusCode: error.code, clusterStatusCode: error.clusterCode });
                            continue;
                        }
                        writeResults.push({ path, statusCode: StatusCode.ConstraintError });
                        continue;
                    } else {
                        logger.debug(
                            `While handling write request from ${
                                exchange.channel.name
                            } to ${this.#endpointStructure.resolveAttributeName(path)} ignored: ${error.message}`,
                        );

                        // TODO - This behavior may be wrong.
                        //
                        // If a wildcard write fails we should either:
                        //
                        //   1. Ignore entirely (add nothing to write results), or
                        //   2. Add an error response for the concrete attribute that failed.
                        //
                        // Spec is a little ambiguous.  After request path expansion, in core 1.2 8.7.3.2 it states:
                        //
                        //   "If the path indicates attribute data that is not writable, then the path SHALL be
                        //    discarded"
                        //
                        // So is this "not writable" -- so it should be #1 -- or is this "writable" but with invalid
                        // data?  The latter is error case #2 but spec doesn't make clear what the status code would
                        // be...  We could fall back to CONSTRAINT_ERROR like we do above though
                        //
                        // Currently what we do is add a success response for every concrete path that fails.
                    }
                }
                writeResults.push({ path, statusCode: StatusCode.Success });
            }
            //.filter(({ statusCode }) => statusCode !== StatusCode.Success); // see https://github.com/project-chip/connectedhomeip/issues/26198
        }

        const errorResults = writeResults.filter(({ statusCode }) => statusCode !== StatusCode.Success);
        logger.debug(
            `Write request from ${exchange.channel.name} done ${
                errorResults.length
                    ? `with following errors: ${errorResults
                          .map(
                              ({ path, statusCode }) =>
                                  `${this.#endpointStructure.resolveAttributeName(path)}=${Logger.toJSON(statusCode)}`,
                          )
                          .join(", ")}`
                    : "without errors"
            }`,
        );

        const response = {
            interactionModelRevision: INTERACTION_MODEL_REVISION,
            writeResponses: writeResults.map(({ path, statusCode, clusterStatusCode }) => ({
                path,
                status: { status: statusCode, clusterStatus: clusterStatusCode },
            })),
        };

        // Trigger attribute events for delayed list writes
        for (const attribute of attributeListWrites.values()) {
            try {
                attribute.triggerDelayedChangeEvents();
            } catch (error) {
                logger.error(
                    `Ignored Error while writing attribute from ${exchange.channel.name} to ${attribute.name}:`,
                    error,
                );
            }
        }

        return response;
    }

    protected async writeAttribute(
        _path: AttributePath,
        attribute: AttributeServer<any>,
        value: any,
        exchange: MessageExchange<MatterDevice>,
        message: Message,
        _endpoint: EndpointInterface,
        _receivedWithinTimedInteraction?: boolean,
        isListWrite = false,
    ) {
        attribute.set(value, exchange.session, message, isListWrite);
    }

    async handleSubscribeRequest(
        exchange: MessageExchange<MatterDevice>,
        {
            minIntervalFloorSeconds,
            maxIntervalCeilingSeconds,
            attributeRequests,
            dataVersionFilters,
            eventRequests,
            eventFilters,
            keepSubscriptions,
            isFabricFiltered,
            interactionModelRevision,
        }: SubscribeRequest,
        messenger: InteractionServerMessenger,
        message: Message,
    ): Promise<void> {
        logger.debug(
            `Received subscribe request from ${exchange.channel.name} (keepSubscriptions=${keepSubscriptions}, isFabricFiltered=${isFabricFiltered})`,
        );

        if (interactionModelRevision > INTERACTION_MODEL_REVISION) {
            logger.debug(
                `Interaction model revision of sender ${interactionModelRevision} is higher than supported ${INTERACTION_MODEL_REVISION}.`,
            );
        }

        if (message.packetHeader.sessionType !== SessionType.Unicast) {
            throw new StatusResponseError(
                "Subscriptions are only allowed on unicast sessions",
                StatusCode.InvalidAction,
            );
        }

        assertSecureSession(exchange.session, "Subscriptions are only implemented on secure sessions");
        const session = exchange.session;
        const fabric = session.fabric;
        if (fabric === undefined)
            throw new StatusResponseError(
                "Subscriptions are only implemented after a fabric has been assigned",
                StatusCode.InvalidAction,
            );

        if (
            (!Array.isArray(attributeRequests) || attributeRequests.length === 0) &&
            (!Array.isArray(eventRequests) || eventRequests.length === 0)
        ) {
            throw new StatusResponseError("No attributes or events requested", StatusCode.InvalidAction);
        }

        logger.debug(
            `Subscribe to attributes:${
                attributeRequests?.map(path => this.#endpointStructure.resolveAttributeName(path)).join(", ") ?? "none"
            }, events:${
                eventRequests?.map(path => this.#endpointStructure.resolveEventName(path)).join(", ") ?? "none"
            }`,
        );

        if (dataVersionFilters !== undefined && dataVersionFilters.length > 0) {
            logger.debug(
                `DataVersionFilters: ${dataVersionFilters
                    .map(
                        ({ path: { nodeId, endpointId, clusterId }, dataVersion }) =>
                            `${clusterPathToId({ nodeId, endpointId, clusterId })}=${dataVersion}`,
                    )
                    .join(", ")}`,
            );
        }
        if (eventFilters !== undefined && eventFilters.length > 0)
            logger.debug(
                `Event filters: ${eventFilters.map(filter => `${filter.nodeId}/${filter.eventMin}`).join(", ")}`,
            );

        // Validate of the paths before proceeding
        attributeRequests?.forEach(path => validateReadAttributesPath(path));
        eventRequests?.forEach(path => validateReadEventPath(path));

        if (minIntervalFloorSeconds < 0) {
            throw new StatusResponseError(
                "minIntervalFloorSeconds should be greater or equal to 0",
                StatusCode.InvalidAction,
            );
        }
        if (maxIntervalCeilingSeconds < 0) {
            throw new StatusResponseError(
                "maxIntervalCeilingSeconds should be greater or equal to 1",
                StatusCode.InvalidAction,
            );
        }
        if (maxIntervalCeilingSeconds < minIntervalFloorSeconds) {
            throw new StatusResponseError(
                "maxIntervalCeilingSeconds should be greater or equal to minIntervalFloorSeconds",
                StatusCode.InvalidAction,
            );
        }

        // TODO: Interpret specs:
        // The publisher SHALL compute an appropriate value for the MaxInterval field in the action. This SHALL respect the following constraint: MinIntervalFloor ≤ MaxInterval ≤ MAX(SUBSCRIPTION_MAX_INTERVAL_PUBLISHER_LIMIT=60mn, MaxIntervalCeiling)

        if (this.#nextSubscriptionId === 0xffffffff) this.#nextSubscriptionId = 0;
        const subscriptionId = this.#nextSubscriptionId++;
        const subscriptionHandler = new SubscriptionHandler(
            subscriptionId,
            session,
            this.#endpointStructure,
            attributeRequests,
            dataVersionFilters,
            eventRequests,
            eventFilters,
            this.#eventHandler,
            isFabricFiltered,
            minIntervalFloorSeconds,
            maxIntervalCeilingSeconds,
            () => this.#subscriptionMap.delete(subscriptionId),
            this.#subscriptionConfig,
        );

        try {
            // Send initial data report to prime the subscription with initial data
            await subscriptionHandler.sendInitialReport(
                messenger,
                (path, attribute) =>
                    this.readAttribute(
                        path,
                        attribute,
                        exchange,
                        isFabricFiltered,
                        message,
                        this.#endpointStructure.getEndpoint(path.endpointId)!,
                    ),
                (path, event, eventFilters) =>
                    this.readEvent(
                        path,
                        eventFilters,
                        event,
                        exchange,
                        isFabricFiltered,
                        message,
                        this.#endpointStructure.getEndpoint(path.endpointId)!,
                    ),
            );
        } catch (error: any) {
            logger.error(
                `Subscription ${subscriptionId} for Session ${session.id}: Error while sending initial data reports`,
                error,
            );
            await subscriptionHandler.cancel(); // Cleanup
            if (error instanceof StatusResponseError) {
                logger.info(`Sending status response ${error.code} for interaction error: ${error.message}`);
                await messenger.sendStatus(error.code);
            }
            await messenger.close();
            return; // Make sure to not bubble up the exception
        }

        if (!keepSubscriptions) {
            logger.debug(`Clear subscriptions for Session ${session.name} because keepSubscriptions=false`);
            await session.clearSubscriptions(true);
        }

        const maxInterval = subscriptionHandler.getMaxInterval();
        logger.info(
            `Successfully created subscription ${subscriptionId} for Session ${
                session.id
            }. Updates: ${minIntervalFloorSeconds} - ${maxIntervalCeilingSeconds} => ${maxInterval} seconds (sendInterval = ${subscriptionHandler.getSendInterval()} seconds)`,
        );
        // Then send the subscription response
        await messenger.send(
            MessageType.SubscribeResponse,
            TlvSubscribeResponse.encode({
                subscriptionId,
                maxInterval,
                interactionModelRevision: INTERACTION_MODEL_REVISION,
            }),
        );

        this.#subscriptionMap.set(subscriptionId, subscriptionHandler);
        session.addSubscription(subscriptionHandler);
        subscriptionHandler.activateSendingUpdates();
    }

    async handleInvokeRequest(
        exchange: MessageExchange<MatterDevice>,
        { invokeRequests, timedRequest, suppressResponse, interactionModelRevision }: InvokeRequest,
        message: Message,
    ): Promise<InvokeResponse> {
        logger.debug(
            `Received invoke request from ${exchange.channel.name}: ${invokeRequests
                .map(({ commandPath: { endpointId, clusterId, commandId } }) =>
                    this.#endpointStructure.resolveCommandName({ endpointId, clusterId, commandId }),
                )
                .join(", ")}, suppressResponse=${suppressResponse}`,
        );

        if (interactionModelRevision > INTERACTION_MODEL_REVISION) {
            logger.debug(
                `Interaction model revision of sender ${interactionModelRevision} is higher than supported ${INTERACTION_MODEL_REVISION}.`,
            );
        }

        const receivedWithinTimedInteraction = exchange.hasActiveTimedInteraction();
        if (exchange.hasExpiredTimedInteraction()) {
            exchange.clearTimedInteraction(); // ??
            throw new StatusResponseError(`Timed request window expired. Decline invoke request.`, StatusCode.Timeout);
        }

        if (timedRequest !== exchange.hasTimedInteraction()) {
            throw new StatusResponseError(
                `timedRequest flag of invoke interaction (${timedRequest}) mismatch with expected timed interaction (${receivedWithinTimedInteraction}).`,
                StatusCode.TimedRequestMismatch,
            );
        }

        if (receivedWithinTimedInteraction) {
            logger.debug(`Invoke request from ${exchange.channel.name} received while timed interaction is running.`);
            exchange.clearTimedInteraction();
            if (message.packetHeader.sessionType !== SessionType.Unicast) {
                throw new StatusResponseError(
                    "Invoke requests are only allowed on unicast sessions when a timed interaction is running.",
                    StatusCode.InvalidAction,
                ); // ???
            }
        }

        if (invokeRequests.length > MAX_PATHS_PER_INVOKE) {
            throw new StatusResponseError(
                `Only ${MAX_PATHS_PER_INVOKE} invoke requests are supported in one message. This message contains ${invokeRequests.length}`,
                StatusCode.InvalidAction,
            );
        }

        invokeRequests.forEach(({ commandPath }) => validateCommandPath(commandPath));

        const invokeResponses: TypeFromSchema<typeof TlvInvokeResponseData>[] = [];

        await Promise.all(
            invokeRequests.flatMap(async ({ commandPath, commandFields }) => {
                const commands = this.#endpointStructure.getCommands([commandPath]);

                // TODO also check ACL and Timed, Fabric scoping constrains

                if (commands.length === 0) {
                    // TODO Also check nodeId
                    if (!isConcreteCommandPath(commandPath)) {
                        // Wildcard path: Just ignore
                        logger.debug(
                            `Invoke from ${exchange.channel.name}: ${this.#endpointStructure.resolveCommandName(
                                commandPath,
                            )} ignore non-existing attribute`,
                        );
                    } else {
                        const { endpointId, clusterId, commandId } = commandPath;
                        invokeResponses.push(
                            tryCatch(
                                () => {
                                    this.#endpointStructure.validateConcreteCommandPath(
                                        endpointId,
                                        clusterId,
                                        commandId,
                                    );
                                    throw new InternalError(
                                        "validateConcreteCommandPath should throw StatusResponseError but did not.",
                                    );
                                },
                                StatusResponseError,
                                error => {
                                    logger.debug(
                                        `Invoke from ${
                                            exchange.channel.name
                                        }: ${this.#endpointStructure.resolveCommandName(
                                            commandPath,
                                        )} unsupported path: Status=${error.code}`,
                                    );
                                    return { status: { commandPath, status: { status: error.code } } };
                                },
                            ),
                        );
                    }
                    return;
                }

                for (const { command, path } of commands) {
                    const { endpointId } = path;
                    if (endpointId === undefined) {
                        // Should never happen
                        logger.error(
                            `Invoke from ${exchange.channel.name}: ${this.#endpointStructure.resolveCommandName(
                                path,
                            )} invalid path because empty endpoint!`,
                        );
                        invokeResponses.push({
                            status: { commandPath: path, status: { status: StatusCode.UnsupportedEndpoint } },
                        });
                        continue;
                    }
                    const endpoint = this.#endpointStructure.getEndpoint(endpointId);
                    if (endpoint === undefined) {
                        // Should never happen
                        logger.error(
                            `Invoke from ${exchange.channel.name}: ${this.#endpointStructure.resolveCommandName(
                                path,
                            )} invalid path because endpoint not found!`,
                        );
                        invokeResponses.push({
                            status: { commandPath: path, status: { status: StatusCode.UnsupportedEndpoint } },
                        });
                        continue;
                    }
                    if (command.requiresTimedInteraction && !receivedWithinTimedInteraction) {
                        logger.debug(`This invoke requires a timed interaction which is not initialized.`);
                        invokeResponses.push({
                            status: { commandPath: path, status: { status: StatusCode.NeedsTimedInteraction } },
                        });
                        continue;
                    }

                    const result = await tryCatchAsync(
                        async () =>
                            await this.invokeCommand(
                                path,
                                command,
                                exchange,
                                commandFields ?? TlvNoArguments.encodeTlv(commandFields),
                                message,
                                endpoint,
                                receivedWithinTimedInteraction,
                            ),
                        StatusResponseError,
                        async error => {
                            const errorLogText = `Error ${Diagnostic.hex(error.code)}${
                                error.clusterCode !== undefined ? `/${Diagnostic.hex(error.clusterCode)}` : ""
                            } while invoking command: ${error.message}`;
                            if (error instanceof ValidationError) {
                                logger.info(
                                    `Validation-${errorLogText}${error.fieldName !== undefined ? ` in field ${error.fieldName}` : ""}`,
                                );
                            } else {
                                logger.info(errorLogText);
                            }
                            return {
                                code: error.code,
                                clusterCode: error.clusterCode,
                                responseId: command.responseId,
                                response: TlvNoResponse.encodeTlv(),
                            };
                        },
                    );
                    const { code, clusterCode, responseId, response } = result;
                    if (response.length === 0) {
                        invokeResponses.push({
                            status: { commandPath: path, status: { status: code, clusterStatus: clusterCode } },
                        });
                    } else {
                        invokeResponses.push({
                            command: {
                                commandPath: { ...path, commandId: responseId },
                                commandFields: response,
                            },
                        });
                    }
                }
            }),
        );

        // TODO support suppressResponse for responses
        return {
            suppressResponse: false,
            interactionModelRevision: INTERACTION_MODEL_REVISION,
            invokeResponses,
        };
    }

    protected async invokeCommand(
        _path: CommandPath,
        command: CommandServer<any, any>,
        exchange: MessageExchange<MatterDevice>,
        commandFields: any,
        message: Message,
        endpoint: EndpointInterface,
        _receivedWithinTimedInteraction = false,
    ) {
        return command.invoke(exchange.session, commandFields, message, endpoint);
    }

    handleTimedRequest(exchange: MessageExchange<MatterDevice>, { timeout, interactionModelRevision }: TimedRequest) {
        logger.debug(`Received timed request (${timeout}ms) from ${exchange.channel.name}`);

        if (interactionModelRevision > INTERACTION_MODEL_REVISION) {
            logger.debug(
                `Interaction model revision of sender ${interactionModelRevision} is higher than supported ${INTERACTION_MODEL_REVISION}.`,
            );
        }

        exchange.startTimedInteraction(timeout);
    }

    async close() {
        this.#isClosing = true;
        for (const subscription of this.#subscriptionMap.values()) {
            await subscription.cancel(true);
        }
    }
}

export namespace InteractionServer {
    export interface Configuration {
        readonly subscriptionOptions?: SubscriptionOptions;
        readonly eventHandler: EventHandler;
        readonly endpointStructure: InteractionEndpointStructure;
    }
}
