[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [endpoint/definitions/device/OnOffSensorDevice](../modules/endpoint_definitions_device_OnOffSensorDevice.md) / OnOffSensorDevice

# Interface: OnOffSensorDevice

[endpoint/definitions/device/OnOffSensorDevice](../modules/endpoint_definitions_device_OnOffSensorDevice.md).OnOffSensorDevice

An On/Off Sensor is a measurement and sensing device that, when bound to a lighting device such as a Dimmable Light,
is capable of being used to switch the device on or off.

**`See`**

MatterSpecification.v11.Device § 7.8

## Hierarchy

- [`Identity`](../modules/util_export.md#identity)\<typeof [`OnOffSensorDeviceDefinition`](../modules/endpoint_definitions_device_OnOffSensorDevice.md#onoffsensordevicedefinition)\>

  ↳ **`OnOffSensorDevice`**

## Table of contents

### Properties

- [behaviors](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#behaviors)
- [defaults](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#defaults)
- [deviceClass](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#deviceclass)
- [deviceRevision](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#devicerevision)
- [deviceType](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#devicetype)
- [name](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#name)
- [requirements](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#requirements)

### Methods

- [set](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#set)
- [with](endpoint_definitions_device_OnOffSensorDevice.OnOffSensorDevice.md#with)

## Properties

### behaviors

• **behaviors**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `identify` | typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md) |

#### Inherited from

Identity.behaviors

#### Defined in

[packages/matter.js/src/endpoint/type/MutableEndpoint.ts:84](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/MutableEndpoint.ts#L84)

___

### defaults

• **defaults**: [`StateOf`](../modules/behavior_cluster_export._internal_.SupportedBehaviors.md#stateof)\<\{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  }\>

Access default state values.

#### Inherited from

Identity.defaults

#### Defined in

[packages/matter.js/src/endpoint/type/MutableEndpoint.ts:89](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/MutableEndpoint.ts#L89)

___

### deviceClass

• **deviceClass**: [`DeviceClasses`](../enums/device_export.DeviceClasses.md)

#### Inherited from

Identity.deviceClass

#### Defined in

[packages/matter.js/src/endpoint/type/EndpointType.ts:51](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/EndpointType.ts#L51)

___

### deviceRevision

• **deviceRevision**: `number`

#### Inherited from

Identity.deviceRevision

#### Defined in

[packages/matter.js/src/endpoint/type/EndpointType.ts:50](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/EndpointType.ts#L50)

___

### deviceType

• **deviceType**: [`DeviceTypeId`](../modules/datatype_export.md#devicetypeid)

#### Inherited from

Identity.deviceType

#### Defined in

[packages/matter.js/src/endpoint/type/EndpointType.ts:49](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/EndpointType.ts#L49)

___

### name

• **name**: ``"OnOffSensor"``

#### Inherited from

Identity.name

#### Defined in

[packages/matter.js/src/endpoint/type/EndpointType.ts:48](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/EndpointType.ts#L48)

___

### requirements

• **requirements**: typeof [`OnOffSensorRequirements`](../modules/endpoint_definitions_device_OnOffSensorDevice.OnOffSensorRequirements.md)

#### Inherited from

Identity.requirements

#### Defined in

[packages/matter.js/src/endpoint/type/EndpointType.ts:53](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/EndpointType.ts#L53)

## Methods

### set

▸ **set**(`defaults`): [`With`](../modules/node_export._internal_.md#with)\<[`For`](../modules/behavior_cluster_export._internal_.EndpointType.md#for)\<\{ `behaviors`: \{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  } ; `deviceRevision`: ``2`` = 2; `deviceType`: ``2128`` = 0x850; `name`: ``"OnOffSensor"`` = "OnOffSensor"; `requirements`: typeof [`OnOffSensorRequirements`](../modules/endpoint_definitions_device_OnOffSensorDevice.OnOffSensorRequirements.md) = OnOffSensorRequirements }\>, \{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  }\>

Define an endpoint like this one with different defaults.  Only updates values present in the input object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `defaults` | [`InputStateOf`](../modules/behavior_cluster_export._internal_.SupportedBehaviors.md#inputstateof)\<\{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  }\> |

#### Returns

[`With`](../modules/node_export._internal_.md#with)\<[`For`](../modules/behavior_cluster_export._internal_.EndpointType.md#for)\<\{ `behaviors`: \{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  } ; `deviceRevision`: ``2`` = 2; `deviceType`: ``2128`` = 0x850; `name`: ``"OnOffSensor"`` = "OnOffSensor"; `requirements`: typeof [`OnOffSensorRequirements`](../modules/endpoint_definitions_device_OnOffSensorDevice.OnOffSensorRequirements.md) = OnOffSensorRequirements }\>, \{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  }\>

#### Inherited from

Identity.set

#### Defined in

[packages/matter.js/src/endpoint/type/MutableEndpoint.ts:94](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/MutableEndpoint.ts#L94)

___

### with

▸ **with**\<`BL`\>(`...behaviors`): [`With`](../modules/node_export._internal_.md#with)\<[`For`](../modules/behavior_cluster_export._internal_.EndpointType.md#for)\<\{ `behaviors`: \{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  } ; `deviceRevision`: ``2`` = 2; `deviceType`: ``2128`` = 0x850; `name`: ``"OnOffSensor"`` = "OnOffSensor"; `requirements`: typeof [`OnOffSensorRequirements`](../modules/endpoint_definitions_device_OnOffSensorDevice.OnOffSensorRequirements.md) = OnOffSensorRequirements }\>, [`With`](../modules/behavior_cluster_export._internal_.SupportedBehaviors.md#with)\<\{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  }, `BL`\>\>

Define an endpoint like this one with additional and/or replacement server behaviors.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `BL` | extends [`List`](../modules/behavior_cluster_export._internal_.SupportedBehaviors.md#list) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...behaviors` | `BL` |

#### Returns

[`With`](../modules/node_export._internal_.md#with)\<[`For`](../modules/behavior_cluster_export._internal_.EndpointType.md#for)\<\{ `behaviors`: \{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  } ; `deviceRevision`: ``2`` = 2; `deviceType`: ``2128`` = 0x850; `name`: ``"OnOffSensor"`` = "OnOffSensor"; `requirements`: typeof [`OnOffSensorRequirements`](../modules/endpoint_definitions_device_OnOffSensorDevice.OnOffSensorRequirements.md) = OnOffSensorRequirements }\>, [`With`](../modules/behavior_cluster_export._internal_.SupportedBehaviors.md#with)\<\{ `identify`: typeof [`IdentifyServer`](../modules/behavior_definitions_identify_export.IdentifyServer.md)  }, `BL`\>\>

#### Inherited from

Identity.with

#### Defined in

[packages/matter.js/src/endpoint/type/MutableEndpoint.ts:99](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/endpoint/type/MutableEndpoint.ts#L99)
