/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubscriptionBehavior } from "#behavior/system/subscription/SubscriptionBehavior.js";
import {
    Construction,
    InterfaceType,
    Logger,
    NetInterfaceSet,
    Network,
    NetworkInterface,
    NetworkInterfaceDetailed,
    NoAddressAvailableError,
    ObserverGroup,
    TransportInterface,
    TransportInterfaceSet,
    UdpInterface,
} from "#general";
import type { ServerNode } from "#node/ServerNode.js";
import { NodePeerAddressStore } from "#node/client/NodePeerAddressStore.js";
import { InteractionServer } from "#node/server/InteractionServer.js";
import {
    Ble,
    ChannelManager,
    DeviceAdvertiser,
    DeviceCommissioner,
    ExchangeManager,
    InstanceBroadcaster,
    MdnsInstanceBroadcaster,
    MdnsService,
    PeerAddressStore,
    PeerSet,
    ScannerSet,
    SecureChannelProtocol,
    SessionManager,
} from "#protocol";
import { CommissioningServer } from "../commissioning/CommissioningServer.js";
import { ProductDescriptionServer } from "../product-description/ProductDescriptionServer.js";
import { SessionsBehavior } from "../sessions/SessionsBehavior.js";
import { NetworkRuntime } from "./NetworkRuntime.js";
import { ServerGroupNetworking } from "./ServerGroupNetworking.js";

const logger = Logger.get("ServerNetworkRuntime");

function convertNetworkEnvironmentType(type: string | number) {
    const convertedType: InterfaceType =
        typeof type === "string" ? InterfaceType[type as keyof typeof InterfaceType] : type;
    if (typeof convertedType !== "number" || convertedType < 1 || convertedType > 4) {
        return undefined;
    }
    return convertedType;
}

/**
 * Handles network functionality for {@link NodeServer}.
 */
export class ServerNetworkRuntime extends NetworkRuntime {
    #mdnsBroadcaster?: MdnsInstanceBroadcaster;
    #bleBroadcaster?: InstanceBroadcaster;
    #bleTransport?: TransportInterface;
    #ipv6UdpInterface?: UdpInterface;
    #observers = new ObserverGroup(this);
    #formerSubscriptionsHandled = false;
    #groupNetworking?: ServerGroupNetworking;

    override get owner() {
        return super.owner as ServerNode;
    }

    /**
     * Access the MDNS broadcaster for the node.
     */
    get mdnsBroadcaster() {
        if (!this.#mdnsBroadcaster) {
            this.#mdnsBroadcaster = this.owner.env
                .get(MdnsService)
                .createInstanceBroadcaster(this.owner.state.network.operationalPort);
        }
        return this.#mdnsBroadcaster;
    }

    get networkInterfaceConfiguration(): NetworkInterface[] {
        const interfaceConfig = this.owner.env.vars.get<Record<string, { type: string | number }>>(
            "network.interface",
            {},
        );

        return Object.entries(interfaceConfig).map(([name, { type }]) => ({
            name,
            type: convertNetworkEnvironmentType(type),
        }));
    }

    async getNetworkInterfaces(): Promise<NetworkInterfaceDetailed[]> {
        const network = this.owner.env.get(Network);

        const interfaces = await network.getNetInterfaces(this.networkInterfaceConfiguration);
        const interfaceDetails = new Array<NetworkInterfaceDetailed>();
        for (const { name, type } of interfaces) {
            const details = await network.getIpMac(name);
            if (details !== undefined) {
                interfaceDetails.push({ name, type, ...details });
            }
        }
        return interfaceDetails;
    }

    /**
     * A BLE broadcaster.
     */
    protected get bleBroadcaster() {
        if (this.#bleBroadcaster === undefined) {
            const bleData = this.owner.state.commissioning.additionalBleAdvertisementData;
            this.#bleBroadcaster = Ble.get().getBleBroadcaster(bleData);
        }
        return this.#bleBroadcaster;
    }

    /**
     * A BLE transport.
     */
    protected get bleTransport() {
        if (this.#bleTransport === undefined) {
            this.#bleTransport = Ble.get().getBlePeripheralInterface();
        }
        return this.#bleTransport;
    }

    /**
     * Add transports to the {@link TransportInterfaceSet}.
     */
    protected async addTransports(interfaces: TransportInterfaceSet) {
        const netconf = this.owner.state.network;

        const port = this.owner.state.network.port;
        try {
            this.#ipv6UdpInterface = await UdpInterface.create(
                this.owner.env.get(Network),
                "udp6",
                port ? port : undefined,
                netconf.listeningAddressIpv6,
            );
            interfaces.add(this.#ipv6UdpInterface);

            await this.owner.set({ network: { operationalPort: this.#ipv6UdpInterface.port } });
        } catch (error) {
            NoAddressAvailableError.accept(error);
            logger.info(`IPv6 UDP interface not created because IPv6 is not available, but required my Matter.`);
            throw error;
        }

        if (netconf.ipv4) {
            try {
                interfaces.add(
                    await UdpInterface.create(
                        this.owner.env.get(Network),
                        "udp4",
                        netconf.port,
                        netconf.listeningAddressIpv4,
                    ),
                );
            } catch (error) {
                NoAddressAvailableError.accept(error);
                logger.info(`IPv4 UDP interface not created because IPv4 is not available`);
            }
        }

        if (netconf.ble) {
            interfaces.add(this.bleTransport);
        }
    }

    /**
     * Add broadcasters to the {@link DeviceAdvertiser}.
     */
    protected async addBroadcasters(advertiser: DeviceAdvertiser) {
        await advertiser.clearBroadcasters();

        const isCommissioned = !!this.#commissionedFabrics;

        let discoveryCapabilities = this.owner.state.network.discoveryCapabilities;

        if (isCommissioned) {
            // Already commissioned, only broadcast on network
            discoveryCapabilities = { onIpNetwork: true };
        }

        if (discoveryCapabilities.onIpNetwork) {
            advertiser.addBroadcaster(this.mdnsBroadcaster);
        }

        if (discoveryCapabilities.ble) {
            advertiser.addBroadcaster(this.bleBroadcaster);
        }
    }

    /**
     * When the first Fabric gets added we need to enable MDNS broadcasting.
     */
    enableMdnsBroadcasting() {
        const advertiser = this.owner.env.get(DeviceAdvertiser);
        const mdnsBroadcaster = this.mdnsBroadcaster;
        if (!advertiser.hasBroadcaster(mdnsBroadcaster)) {
            logger.debug("Enabling MDNS broadcasting");
            advertiser.addBroadcaster(mdnsBroadcaster);
        }
    }

    /**
     * On commission we turn off bluetooth and join the IP network if we haven't already.
     *
     * On decommission we're destroyed so don't need to handle that case.
     */
    endUncommissionedMode() {
        // Ensure MDNS broadcasting are active when the first fabric is added.  It might not be active initially if the
        // node was not on an IP network prior to commissioning
        this.enableMdnsBroadcasting();

        if (this.#bleBroadcaster) {
            this.owner.env.runtime.add(this.#removeBleBroadcaster(this.#bleBroadcaster));
            this.#bleBroadcaster = undefined;
        }

        if (this.#bleTransport) {
            this.owner.env.runtime.add(this.#removeBleTransport(this.#bleTransport));
            this.#bleTransport = undefined;
        }
    }

    async #removeBleBroadcaster(bleBroadcaster: InstanceBroadcaster) {
        const advertiser = this.owner.env.get(DeviceAdvertiser);
        await advertiser.deleteBroadcaster(bleBroadcaster);
        await bleBroadcaster.close();
    }

    async #removeBleTransport(bleTransport: TransportInterface) {
        const transportInterfaces = this.owner.env.get(TransportInterfaceSet);
        transportInterfaces.delete(bleTransport);
        await bleTransport.close();
    }

    get #commissionedFabrics() {
        return this.owner.state.operationalCredentials.commissionedFabrics;
    }

    protected override async start() {
        const { owner } = this;
        const { env } = owner;

        // Ensure MdnsService is fully constructed
        await env.load(MdnsService);

        const advertiser = env.get(DeviceAdvertiser);
        // Configure network
        const interfaces = env.get(TransportInterfaceSet);
        await this.addTransports(interfaces);
        env.set(NetInterfaceSet, interfaces);
        await this.addBroadcasters(advertiser);

        await owner.act("start-network", agent => agent.load(ProductDescriptionServer));

        // Apply settings to environmental components
        env.get(ChannelManager).caseSessionsPerFabricAndNode =
            // Note that this is "sessions per fabric and node", so we support more than indicated by capabilityMinima
            owner.state.basicInformation.capabilityMinima.caseSessionsPerFabric;
        env.get(SessionManager).sessionParameters = {
            maxPathsPerInvoke: this.owner.state.basicInformation.maxPathsPerInvoke,
        };

        await this.#initializeGroupNetworking();

        // Install our interaction server
        const interactionServer = new InteractionServer(this.owner, env.get(SessionManager));
        env.set(InteractionServer, interactionServer);
        env.get(ExchangeManager).addProtocolHandler(interactionServer);

        // Ensure SecureChannelProtocol is installed
        env.get(SecureChannelProtocol);

        await this.owner.act("load-sessions", agent => agent.load(SessionsBehavior));

        // Monitor CommissioningServer to end "uncommissioned" mode when we are commissioned
        this.#observers.on(this.owner.eventsOf(CommissioningServer).commissioned, this.endUncommissionedMode);

        // Monitor DeviceAdvertiser to enable MDNS broadcasting when the first Fabric is added
        this.#observers.on(advertiser.operationalModeEnabled, this.enableMdnsBroadcasting);
    }

    override async [Construction.construct]() {
        await super[Construction.construct]();

        // Initialize ScannerSet
        this.owner.env.get(ScannerSet).add((await this.owner.env.load(MdnsService)).scanner);
        this.owner.env.set(PeerAddressStore, new NodePeerAddressStore(this.owner));
        await this.owner.env.load(PeerSet);

        // Restore previous subscriptions
        //
        // TODO - move to SubscriptionsBehavior, and rename to SubscriptionsServer?
        if (!this.#formerSubscriptionsHandled) {
            await this.#reestablishFormerSubscriptions();
        }
    }

    protected override async stop() {
        this.blockNewActivity();

        this.#observers.close();

        const { env } = this.owner;

        await env.close(DeviceCommissioner);
        // Shutdown the Broadcaster if DeviceAdvertiser is not initialized
        // We kick-off the Advertiser shutdown to prevent re-announces when removing sessions and wait a bit later
        const advertisementShutdown = this.owner.env.has(DeviceAdvertiser)
            ? this.owner.env.close(DeviceAdvertiser)
            : this.#mdnsBroadcaster?.close();
        this.#mdnsBroadcaster = undefined;

        await this.owner.prepareRuntimeShutdown();

        this.#groupNetworking?.close();
        this.#groupNetworking = undefined;

        // Now all sessions are closed, so we wait for Advertiser to be gone
        await advertisementShutdown;

        await env.close(ExchangeManager);
        await env.close(SecureChannelProtocol);
        await env.close(TransportInterfaceSet);
        await env.close(InteractionServer);
    }

    protected override blockNewActivity() {
        this.owner.env.maybeGet(InteractionServer)?.blockNewActivity();
    }

    async #reestablishFormerSubscriptions() {
        const { env } = this.owner;
        if (!env.has(InteractionServer)) {
            return;
        }
        this.#formerSubscriptionsHandled = true;

        await this.owner.act(agent =>
            agent.get(SubscriptionBehavior).reestablishFormerSubscriptions(env.get(InteractionServer)),
        );
    }

    async #initializeGroupNetworking() {
        if (this.#groupNetworking) {
            logger.warn("Group networking already initialized, skipping.");
            return;
        }
        if (this.#ipv6UdpInterface === undefined) {
            logger.warn("No IPv6 UDP interface available, skipping group networking initialization.");
            return;
        }

        this.#groupNetworking = new ServerGroupNetworking(this.owner.env, this.#ipv6UdpInterface);
        await this.#groupNetworking.construction;
    }
}
