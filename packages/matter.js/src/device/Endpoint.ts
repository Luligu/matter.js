/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    BasicInformationCluster,
    BridgedDeviceBasicInformationCluster,
    FixedLabelCluster,
    UserLabelCluster,
} from "#clusters";
import { AtLeastOne, Diagnostic, ImplementationError, InternalError, NotImplementedError } from "#general";
import { ClusterClientObj, SupportedAttributeClient, UnknownSupportedAttributeClient } from "#protocol";
import {
    Attributes,
    BitSchema,
    Cluster,
    ClusterId,
    ClusterType,
    Commands,
    DeviceTypeId,
    EndpointNumber,
    Events,
    TypeFromPartialBitSchema,
    getClusterNameById,
} from "#types";
import { ClusterServer } from "../cluster/server/ClusterServer.js";
import { ClusterServerObj, asClusterServerInternal } from "../cluster/server/ClusterServerTypes.js";
import { DeviceTypeDefinition } from "./DeviceTypes.js";

export interface EndpointOptions {
    endpointId?: EndpointNumber;
    uniqueStorageKey?: string;
}

export class Endpoint {
    private readonly clusterServers = new Map<ClusterId, ClusterServerObj>();
    private readonly clusterClients = new Map<ClusterId, ClusterClientObj>();
    private readonly childEndpoints: Endpoint[] = [];
    number: EndpointNumber | undefined;
    uniqueStorageKey: string | undefined;
    name = "";
    private structureChangedCallback: () => void = () => {
        /** noop until officially set **/
    };

    /**
     * Create a new Endpoint instance.
     *
     * @param deviceTypes One or multiple DeviceTypeDefinitions of the endpoint
     * @param options Options for the endpoint
     */
    constructor(
        protected deviceTypes: AtLeastOne<DeviceTypeDefinition>,
        options: EndpointOptions = {},
    ) {
        this.setDeviceTypes(deviceTypes);

        if (options.endpointId !== undefined) {
            this.number = options.endpointId;
        }
        if (options.uniqueStorageKey !== undefined) {
            this.uniqueStorageKey = options.uniqueStorageKey;
        }
    }

    get deviceType(): DeviceTypeId {
        return this.deviceTypes[0].code;
    }

    setStructureChangedCallback(callback: () => void) {
        this.structureChangedCallback = callback;
        this.childEndpoints.forEach(endpoint => endpoint.setStructureChangedCallback(callback));
    }

    removeFromStructure() {
        this.close();
        this.structureChangedCallback = () => {
            /** noop **/
        };
        this.childEndpoints.forEach(endpoint => endpoint.removeFromStructure());
    }

    close() {
        for (const clusterServer of this.clusterServers.values()) {
            asClusterServerInternal(clusterServer)._close();
        }
    }

    getNumber() {
        if (this.number === undefined) {
            throw new InternalError("Endpoint has not been assigned yet");
        }
        return this.number;
    }

    addFixedLabel(label: string, value: string) {
        if (!this.hasClusterServer(FixedLabelCluster)) {
            this.addClusterServer(
                ClusterServer(
                    FixedLabelCluster,
                    {
                        labelList: [],
                    },
                    {},
                ),
            );
        }
        const fixedLabelCluster = this.getClusterServer(FixedLabelCluster);
        const labelList = (fixedLabelCluster?.getLabelListAttribute() ?? []).filter(
            ({ label: entryLabel }) => entryLabel !== label, // Prevent adding duplicate labels
        );
        labelList.push({ label, value });
        fixedLabelCluster?.setLabelListAttribute(labelList);
    }

    addUserLabel(label: string, value: string) {
        if (!this.hasClusterServer(UserLabelCluster)) {
            this.addClusterServer(
                ClusterServer(
                    UserLabelCluster,
                    {
                        labelList: [],
                    },
                    {},
                ),
            );
        }
        const userLabelCluster = this.getClusterServer(UserLabelCluster);
        const labelList = (userLabelCluster?.getLabelListAttribute() ?? []).filter(
            ({ label: entryLabel }) => entryLabel !== label, // Prevent adding duplicate labels
        );
        labelList.push({ label, value });
        userLabelCluster?.setLabelListAttribute(labelList);
    }

    addClusterServer<const T extends ClusterType>(cluster: ClusterServerObj<T>) {
        const currentCluster = this.clusterServers.get(cluster.id);
        if (currentCluster !== undefined) {
            asClusterServerInternal(currentCluster)._close();
        }
        asClusterServerInternal(cluster)._assignToEndpoint(this);

        // In ts4 the cast to "any" here was unnecessary.  In TS5 the fact that
        // the string index signature in Attributes and Events doesn't allow
        // for undefined results in the error:
        //
        //   Type 'undefined' is not assignable to type '() => any'
        //
        // I'm not sure if I'd classify the old or new behavior as more correct
        // but the solution would be to add "| undefined" to the string index
        // signature in Attributes and Events, which will force additional
        // assertions everywhere those interfaces are used.  I'm treating that
        // as low priority for now
        this.clusterServers.set(cluster.id, cluster as any);
    }

    addClusterClient(cluster: ClusterClientObj) {
        this.clusterClients.set(cluster.id, cluster);
    }

    // TODO cleanup with id number vs ClusterId
    // TODO add instance if optional and not existing, maybe get rid of undefined by throwing?
    getClusterServer<const T extends ClusterType>(cluster: T): ClusterServerObj<T> | undefined {
        const clusterServer = this.clusterServers.get(cluster.id);
        if (clusterServer !== undefined) {
            // See comment in addClusterServer, this is the inverse of that
            // issue
            return clusterServer as unknown as ClusterServerObj<T>;
        }
    }

    getClusterClient<const T extends ClusterType>(cluster: T): ClusterClientObj<T> | undefined {
        return this.clusterClients.get(cluster.id) as ClusterClientObj<T>;
    }

    getClusterServerById(clusterId: ClusterId): ClusterServerObj | undefined {
        return this.clusterServers.get(clusterId);
    }

    getClusterClientById(clusterId: ClusterId): ClusterClientObj | undefined {
        return this.clusterClients.get(clusterId);
    }

    hasClusterServer<
        F extends BitSchema,
        SF extends TypeFromPartialBitSchema<F>,
        A extends Attributes,
        C extends Commands,
        E extends Events,
    >(cluster: Cluster<F, SF, A, C, E>): boolean {
        return this.clusterServers.has(cluster.id);
    }

    hasClusterClient<
        F extends BitSchema,
        SF extends TypeFromPartialBitSchema<F>,
        A extends Attributes,
        C extends Commands,
        E extends Events,
    >(cluster: Cluster<F, SF, A, C, E>): boolean {
        return this.clusterClients.has(cluster.id);
    }

    getDeviceTypes(): AtLeastOne<DeviceTypeDefinition> {
        return this.deviceTypes;
    }

    setDeviceTypes(deviceTypes: AtLeastOne<DeviceTypeDefinition>): void {
        // Remove duplicates, for now we ignore that there could be different revisions
        const deviceTypeList = new Map<number, DeviceTypeDefinition>();
        deviceTypes.forEach(deviceType => deviceTypeList.set(deviceType.code, deviceType));
        this.deviceTypes = Array.from(deviceTypeList.values()) as AtLeastOne<DeviceTypeDefinition>;
        this.name = deviceTypes[0].name;
    }

    addChildEndpoint(endpoint: Endpoint): void {
        if (!(endpoint instanceof Endpoint)) {
            throw new Error("Only supported EndpointInterface implementation is Endpoint");
        }

        if (endpoint.number !== undefined && this.getChildEndpoint(endpoint.number) !== undefined) {
            throw new ImplementationError(
                `Endpoint with id ${endpoint.number} already exists as child from ${this.number}.`,
            );
        }

        this.childEndpoints.push(endpoint);
        endpoint.setStructureChangedCallback(this.structureChangedCallback);
        this.structureChangedCallback(); // Inform parent about structure change
    }

    getChildEndpoint(id: EndpointNumber): Endpoint | undefined {
        return this.childEndpoints.find(endpoint => endpoint.number === id);
    }

    getChildEndpoints(): Endpoint[] {
        return this.childEndpoints;
    }

    protected removeChildEndpoint(endpoint: Endpoint): void {
        const index = this.childEndpoints.indexOf(endpoint);
        if (index === -1) {
            throw new ImplementationError(`Provided endpoint for deletion does not exist as child endpoint.`);
        }
        this.childEndpoints.splice(index, 1);
        endpoint.removeFromStructure();
        this.structureChangedCallback(); // Inform parent about structure change
    }

    determineUniqueID(): string | undefined {
        // if the options in constructor contained a custom uniqueStorageKey, use this
        if (this.uniqueStorageKey !== undefined) {
            return `custom_${this.uniqueStorageKey}`;
        }
        // Else we check if we have a basic information cluster or bridged device basic information cluster and
        // use the uniqueId or serial number, if provided
        const basicInformationCluster =
            this.getClusterServer(BasicInformationCluster) ??
            this.getClusterServer(BridgedDeviceBasicInformationCluster);
        if (basicInformationCluster !== undefined) {
            const uniqueId = basicInformationCluster.getUniqueIdAttribute?.();
            if (uniqueId !== undefined) {
                return `unique_${uniqueId}`;
            }
            const serialNumber = basicInformationCluster.getSerialNumberAttribute?.();
            if (serialNumber !== undefined) {
                return `serial_${serialNumber}`;
            }
        }
    }

    public verifyRequiredClusters(): void {
        this.deviceTypes.forEach(deviceType => {
            deviceType.requiredServerClusters?.forEach(clusterId => {
                if (!this.clusterServers.has(clusterId)) {
                    const clusterName = getClusterNameById(clusterId);
                    throw new ImplementationError(
                        `Device type ${deviceType.name} (0x${deviceType.code.toString(
                            16,
                        )}) requires cluster server ${clusterName}(0x${clusterId.toString(
                            16,
                        )}) but it is not present on endpoint ${this.number}`,
                    );
                }
            });

            if (this.clusterClients.size > 0) {
                // TODO remove once supported
                throw new NotImplementedError(`Devices with client clusters are not supported yet`);
            }
            deviceType.requiredClientClusters?.forEach(clusterId => {
                const clusterName = getClusterNameById(clusterId);
                if (!this.clusterClients.has(clusterId)) {
                    throw new ImplementationError(
                        `Device type ${deviceType.name} (0x${deviceType.code.toString(
                            16,
                        )}) requires cluster client ${clusterName}(0x${clusterId.toString(
                            16,
                        )}) but it is not present on endpoint ${this.number}`,
                    );
                }
            });
        });
    }

    getAllClusterServers(): ClusterServerObj[] {
        return Array.from(this.clusterServers.values());
    }

    getAllClusterClients(): ClusterClientObj[] {
        return Array.from(this.clusterClients.values());
    }

    /**
     * Hierarchical diagnostics of endpoint and children.
     */
    get [Diagnostic.value](): unknown[] {
        return [
            Diagnostic.strong(this.name),
            Diagnostic.dict({
                "endpoint#": this.number,
                type: this.deviceTypes.map(
                    ({ name, code, revision }) => `${name} (0x${code.toString(16)}, ${revision})`,
                ),
            }),
            Diagnostic.list([...this.#clusterDiagnostics(), ...this.getChildEndpoints()]),
        ];
    }

    #clusterDiagnostics(): unknown[] {
        const clusterDiagnostics = new Array<unknown>();

        const clients = this.getAllClusterClients();
        if (clients.length) {
            clusterDiagnostics.push([
                Diagnostic.strong("clients"),
                Diagnostic.list(clients.map(client => this.#clusterClientDiagnostics(client))),
            ]);
        }

        const servers = this.getAllClusterServers();
        if (servers.length) {
            clusterDiagnostics.push([
                Diagnostic.strong("servers"),
                Diagnostic.list(servers.map(server => this.#clusterServerDiagnostics(server))),
            ]);
        }

        const childs = this.getChildEndpoints();
        if (childs.length) {
            clusterDiagnostics.push([Diagnostic.strong("childs"), Diagnostic.list([])]);
        }

        return clusterDiagnostics;
    }

    #clusterClientDiagnostics(client: ClusterClientObj) {
        const result = [
            Diagnostic.strong(client.name),
            Diagnostic.dict({
                id: Diagnostic.hex(client.id),
                rev: client.revision,
                flags: Diagnostic.asFlags({
                    unknown: client.isUnknown,
                }),
            }),
        ];
        const elementDiagnostic = Array<unknown>();

        const { supportedFeatures: features } = client;
        const supportedFeatures = new Array<string>();
        for (const featureName in features) {
            if (features[featureName] === true) supportedFeatures.push(featureName);
        }
        if (supportedFeatures.length) {
            elementDiagnostic.push([Diagnostic.strong("features"), supportedFeatures]);
        }

        if (Object.keys(client.attributes).length) {
            const clusterData = new Array<unknown>();
            for (const attributeName in client.attributes) {
                const attribute = client.attributes[attributeName];
                if (attribute === undefined || !(attribute instanceof SupportedAttributeClient)) continue;

                clusterData.push([
                    attribute.name,
                    Diagnostic.dict({
                        id: Diagnostic.hex(attribute.id),
                        val: attribute.getLocal(),
                        flags: Diagnostic.asFlags({
                            unknown: attribute instanceof UnknownSupportedAttributeClient,
                            fabricScoped: attribute.fabricScoped,
                        }),
                    }),
                ]);
            }
            if (clusterData.length) {
                elementDiagnostic.push([Diagnostic.strong("attributes"), Diagnostic.list(clusterData)]);
            }
        }

        if (Object.keys(client.commands).length) {
            const clusterData = new Array<unknown>();
            for (const commandName in client.commands) {
                if (commandName.match(/^\d+$/)) continue;
                const command = client.commands[commandName];
                if (command === undefined || !client.isCommandSupportedByName(commandName)) continue;

                clusterData.push([commandName]);
            }
            if (clusterData.length) {
                elementDiagnostic.push([Diagnostic.strong("commands"), Diagnostic.list(clusterData)]);
            }
        }

        if (Object.keys(client.events).length) {
            const clusterData = new Array<unknown>();
            for (const eventName in client.events) {
                const event = client.events[eventName];
                if (event === undefined) continue;

                clusterData.push([
                    event.name,
                    Diagnostic.dict({
                        id: Diagnostic.hex(event.id),
                    }),
                ]);
            }
            if (clusterData.length) {
                elementDiagnostic.push([Diagnostic.strong("events"), Diagnostic.list(clusterData)]);
            }
        }

        if (elementDiagnostic.length) {
            result.push(Diagnostic.list(elementDiagnostic));
        }

        return result;
    }

    #clusterServerDiagnostics(server: ClusterServerObj) {
        return [Diagnostic.strong(server.name)];
    }
}
