[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [cluster/export](../modules/cluster_export.md) / [LevelControl](../modules/cluster_export.LevelControl.md) / MoveRequest

# Interface: MoveRequest

[cluster/export](../modules/cluster_export.md).[LevelControl](../modules/cluster_export.LevelControl.md).MoveRequest

Input to the LevelControl move command

**`See`**

MatterSpecification.v11.Cluster § 1.6.6.2

## Hierarchy

- [`TypeFromSchema`](../modules/tlv_export.md#typefromschema)\<typeof [`TlvMoveRequest`](../modules/cluster_export.LevelControl.md#tlvmoverequest)\>

  ↳ **`MoveRequest`**

## Table of contents

### Properties

- [moveMode](cluster_export.LevelControl.MoveRequest.md#movemode)
- [optionsMask](cluster_export.LevelControl.MoveRequest.md#optionsmask)
- [optionsOverride](cluster_export.LevelControl.MoveRequest.md#optionsoverride)
- [rate](cluster_export.LevelControl.MoveRequest.md#rate)

## Properties

### moveMode

• **moveMode**: [`MoveMode`](../enums/cluster_export.LevelControl.MoveMode.md)

The MoveMode field shall be one of the non-reserved values in Values of the MoveMode Field.

**`See`**

MatterSpecification.v11.Cluster § 1.6.6.2.1

#### Inherited from

TypeFromSchema.moveMode

#### Defined in

[packages/matter.js/src/cluster/definitions/LevelControlCluster.ts:84](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/LevelControlCluster.ts#L84)

___

### optionsMask

• **optionsMask**: [`TypeFromPartialBitSchema`](../modules/schema_export.md#typefrompartialbitschema)\<\{ `coupleColorTempToLevel`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `executeIfOff`: [`BitFlag`](../modules/schema_export.md#bitflag)  }\>

#### Inherited from

TypeFromSchema.optionsMask

#### Defined in

[packages/matter.js/src/cluster/definitions/LevelControlCluster.ts:98](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/LevelControlCluster.ts#L98)

___

### optionsOverride

• **optionsOverride**: [`TypeFromPartialBitSchema`](../modules/schema_export.md#typefrompartialbitschema)\<\{ `coupleColorTempToLevel`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `executeIfOff`: [`BitFlag`](../modules/schema_export.md#bitflag)  }\>

#### Inherited from

TypeFromSchema.optionsOverride

#### Defined in

[packages/matter.js/src/cluster/definitions/LevelControlCluster.ts:99](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/LevelControlCluster.ts#L99)

___

### rate

• **rate**: ``null`` \| `number`

The Rate field specifies the rate of movement in units per second. The actual rate of movement SHOULD be as
close to this rate as the device is able. If the Rate field is equal to null, then the value in
DefaultMoveRate attribute shall be used. However, if the Rate field is equal to null and the DefaultMoveRate
attribute is not supported, or if the Rate field is equal to null and the value of the DefaultMoveRate
attribute is equal to null, then the device SHOULD move as fast as it is able. If the device is not able to
move at a variable rate, this field may be disregarded.

**`See`**

MatterSpecification.v11.Cluster § 1.6.6.2.2

#### Inherited from

TypeFromSchema.rate

#### Defined in

[packages/matter.js/src/cluster/definitions/LevelControlCluster.ts:96](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/LevelControlCluster.ts#L96)
