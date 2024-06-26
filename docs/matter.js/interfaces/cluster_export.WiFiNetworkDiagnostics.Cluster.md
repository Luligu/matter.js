[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [cluster/export](../modules/cluster_export.md) / [WiFiNetworkDiagnostics](../modules/cluster_export.WiFiNetworkDiagnostics.md) / Cluster

# Interface: Cluster

[cluster/export](../modules/cluster_export.md).[WiFiNetworkDiagnostics](../modules/cluster_export.WiFiNetworkDiagnostics.md).Cluster

WiFi Network Diagnostics

The Wi-Fi Network Diagnostics Cluster provides a means to acquire standardized diagnostics metrics that may be
used by a Node to assist a user or Administrator in diagnosing potential problems. The Wi-Fi Network Diagnostics
Cluster attempts to centralize all metrics that are relevant to a potential Wi-Fi radio running on a Node.

WiFiNetworkDiagnosticsCluster supports optional features that you can enable with the
WiFiNetworkDiagnosticsCluster.with() factory method.

**`See`**

MatterSpecification.v11.Core § 11.14

## Hierarchy

- [`Identity`](../modules/util_export.md#identity)\<typeof [`ClusterInstance`](../modules/cluster_export.WiFiNetworkDiagnostics.md#clusterinstance)\>

  ↳ **`Cluster`**

## Table of contents

### Properties

- [attributes](cluster_export.WiFiNetworkDiagnostics.Cluster.md#attributes)
- [base](cluster_export.WiFiNetworkDiagnostics.Cluster.md#base)
- [commands](cluster_export.WiFiNetworkDiagnostics.Cluster.md#commands)
- [events](cluster_export.WiFiNetworkDiagnostics.Cluster.md#events)
- [extensions](cluster_export.WiFiNetworkDiagnostics.Cluster.md#extensions)
- [features](cluster_export.WiFiNetworkDiagnostics.Cluster.md#features)
- [id](cluster_export.WiFiNetworkDiagnostics.Cluster.md#id)
- [name](cluster_export.WiFiNetworkDiagnostics.Cluster.md#name)
- [revision](cluster_export.WiFiNetworkDiagnostics.Cluster.md#revision)
- [supportedFeatures](cluster_export.WiFiNetworkDiagnostics.Cluster.md#supportedfeatures)
- [unknown](cluster_export.WiFiNetworkDiagnostics.Cluster.md#unknown)

### Methods

- [alter](cluster_export.WiFiNetworkDiagnostics.Cluster.md#alter)
- [enable](cluster_export.WiFiNetworkDiagnostics.Cluster.md#enable)
- [set](cluster_export.WiFiNetworkDiagnostics.Cluster.md#set)
- [with](cluster_export.WiFiNetworkDiagnostics.Cluster.md#with)

## Properties

### attributes

• **attributes**: [`Merge`](../modules/util_export.md#merge)\<\{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  }, [`GlobalAttributes`](../modules/cluster_export.md#globalattributes)\<\{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  }\>\>

#### Inherited from

Identity.attributes

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:86](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L86)

___

### base

• **base**: `undefined`

#### Inherited from

Identity.base

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:92](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L92)

___

### commands

• **commands**: `Object`

#### Inherited from

Identity.commands

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:89](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L89)

___

### events

• **events**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `associationFailure` | [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> | The AssociationFailure event shall indicate that a Node has attempted to connect, or reconnect, to a Wi-Fi access point, but is unable to successfully associate or authenticate, after exhausting all internal retries of its supplicant. **`See`** MatterSpecification.v11.Core § 11.14.8.2 |
| `connectionStatus` | [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> | The ConnectionStatus Event shall indicate that a Node’s connection status to a Wi-Fi network has changed. Connected, in this context, shall mean that a Node acting as a Wi-Fi station is successfully associated to a Wi-Fi Access Point. **`See`** MatterSpecification.v11.Core § 11.14.8.3 |
| `disconnection` | [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> | The Disconnection Event shall indicate that a Node’s Wi-Fi connection has been disconnected as a result of de-authenticated or dis-association and indicates the reason. **`See`** MatterSpecification.v11.Core § 11.14.8.1 |

#### Inherited from

Identity.events

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:90](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L90)

___

### extensions

• **extensions**: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }]

#### Inherited from

Identity.extensions

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:93](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L93)

___

### features

• **features**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errorCounts` | [`BitFlag`](../modules/schema_export.md#bitflag) | ErrorCounts Node makes available the counts for the number of errors that have occurred during the reception and transmission of packets on the Wi-Fi interface. |
| `packetCounts` | [`BitFlag`](../modules/schema_export.md#bitflag) | PacketCounts Node makes available the counts for the number of received and transmitted packets on the Wi-Fi interface. |

#### Inherited from

Identity.features

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:84](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L84)

___

### id

• **id**: [`Branded`](../modules/util_export.md#branded)\<``54``, ``"ClusterId"``\>

#### Inherited from

Identity.id

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:81](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L81)

___

### name

• **name**: ``"WiFiNetworkDiagnostics"``

#### Inherited from

Identity.name

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:82](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L82)

___

### revision

• **revision**: ``1``

#### Inherited from

Identity.revision

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:83](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L83)

___

### supportedFeatures

• **supportedFeatures**: `Object`

#### Inherited from

Identity.supportedFeatures

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:85](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L85)

___

### unknown

• **unknown**: ``false``

#### Inherited from

Identity.unknown

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:91](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L91)

## Methods

### alter

▸ **alter**\<`AlterationsT`\>(`alterations`): [`WithAlterations`](../modules/cluster_export.ElementModifier.md#withalterations)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `AlterationsT`\>

Modify elements using [ElementModifier.alter](../classes/cluster_export.ElementModifier-1.md#alter).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `AlterationsT` | extends [`Alterations`](../modules/cluster_export.ElementModifier.md#alterations)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `alterations` | `AlterationsT` |

#### Returns

[`WithAlterations`](../modules/cluster_export.ElementModifier.md#withalterations)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `AlterationsT`\>

#### Inherited from

Identity.alter

#### Defined in

[packages/matter.js/src/cluster/mutation/MutableCluster.ts:74](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/mutation/MutableCluster.ts#L74)

___

### enable

▸ **enable**\<`FlagsT`\>(`flags`): [`WithFlags`](../modules/cluster_export.ElementModifier.md#withflags)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `FlagsT`\>

Modify elements using [ElementModifier.enable](../classes/cluster_export.ElementModifier-1.md#enable).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `FlagsT` | extends [`ElementFlags`](../modules/cluster_export.ElementModifier.md#elementflags)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `flags` | `FlagsT` |

#### Returns

[`WithFlags`](../modules/cluster_export.ElementModifier.md#withflags)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `FlagsT`\>

#### Inherited from

Identity.enable

#### Defined in

[packages/matter.js/src/cluster/mutation/MutableCluster.ts:88](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/mutation/MutableCluster.ts#L88)

___

### set

▸ **set**\<`ValuesT`\>(`values`): [`WithValues`](../modules/cluster_export.ElementModifier.md#withvalues)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `ValuesT`\>

Modify elements using [ElementModifier.set](../classes/cluster_export.ElementModifier-1.md#set).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ValuesT` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `ValuesT` |

#### Returns

[`WithValues`](../modules/cluster_export.ElementModifier.md#withvalues)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `ValuesT`\>

#### Inherited from

Identity.set

#### Defined in

[packages/matter.js/src/cluster/mutation/MutableCluster.ts:81](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/mutation/MutableCluster.ts#L81)

___

### with

▸ **with**\<`SelectionT`\>(`...selection`): [`WithFeatures`](../modules/cluster_export.ClusterComposer.md#withfeatures)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `SelectionT`\>

Select features using [ClusterComposer.compose](../classes/cluster_export.ClusterComposer-1.md#compose).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SelectionT` | extends [`FeatureSelection`](../modules/cluster_export.ClusterComposer.md#featureselection)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...selection` | `SelectionT` |

#### Returns

[`WithFeatures`](../modules/cluster_export.ClusterComposer.md#withfeatures)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `bssid`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `Uint8Array`, `any`\> ; `channelNumber`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `currentMaxRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `number` \| `bigint`, `any`\> ; `rssi`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `securityType`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`SecurityType`](../enums/cluster_export.WiFiNetworkDiagnostics.SecurityType.md), `any`\> ; `wiFiVersion`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| [`WiFiVersion`](../enums/cluster_export.WiFiNetworkDiagnostics.WiFiVersion.md), `any`\>  } ; `events`: \{ `associationFailure`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `associationFailureCause`: [`FieldType`](tlv_export.FieldType.md)\<[`AssociationFailureCause`](../enums/cluster_export.WiFiNetworkDiagnostics.AssociationFailureCause.md)\> ; `status`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\> ; `connectionStatus`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `connectionStatus`: [`FieldType`](tlv_export.FieldType.md)\<[`ConnectionStatus`](../enums/cluster_export.WiFiNetworkDiagnostics.ConnectionStatus.md)\>  }\>, `any`\> ; `disconnection`: [`OptionalEvent`](cluster_export.OptionalEvent.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `reasonCode`: [`FieldType`](tlv_export.FieldType.md)\<`number`\>  }\>, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `beaconLostCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number` \| `bigint`, `any`\>  } ; `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `beaconRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetMulticastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastRxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\> ; `packetUnicastTxCount`: [`Attribute`](cluster_export.Attribute.md)\<``null`` \| `number`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``54`` = 0x36; `name`: ``"WiFiNetworkDiagnostics"`` = "WiFiNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `SelectionT`\>

#### Inherited from

Identity.with

#### Defined in

[packages/matter.js/src/cluster/mutation/MutableCluster.ts:67](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/mutation/MutableCluster.ts#L67)
