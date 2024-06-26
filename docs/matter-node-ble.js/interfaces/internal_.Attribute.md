[@project-chip/matter-node-ble.js](../README.md) / [Exports](../modules.md) / [\<internal\>](../modules/internal_.md) / Attribute

# Interface: Attribute\<T, F\>

[\<internal\>](../modules/internal_.md).Attribute

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `F` | extends [`BitSchema`](../modules/internal_.md#bitschema) |

## Hierarchy

- **`Attribute`**

  ↳ [`FabricScopedAttribute`](internal_.FabricScopedAttribute.md)

  ↳ [`FixedAttribute`](internal_.FixedAttribute.md)

  ↳ [`OptionalAttribute`](internal_.OptionalAttribute.md)

  ↳ [`WritableAttribute`](internal_.WritableAttribute.md)

## Table of contents

### Properties

- [default](internal_.Attribute.md#default)
- [fabricScoped](internal_.Attribute.md#fabricscoped)
- [fixed](internal_.Attribute.md#fixed)
- [id](internal_.Attribute.md#id)
- [isConditional](internal_.Attribute.md#isconditional)
- [mandatoryIf](internal_.Attribute.md#mandatoryif)
- [omitChanges](internal_.Attribute.md#omitchanges)
- [optional](internal_.Attribute.md#optional)
- [optionalIf](internal_.Attribute.md#optionalif)
- [persistent](internal_.Attribute.md#persistent)
- [readAcl](internal_.Attribute.md#readacl)
- [scene](internal_.Attribute.md#scene)
- [schema](internal_.Attribute.md#schema)
- [timed](internal_.Attribute.md#timed)
- [unknown](internal_.Attribute.md#unknown)
- [writable](internal_.Attribute.md#writable)
- [writeAcl](internal_.Attribute.md#writeacl)

## Properties

### default

• `Optional` **default**: `T`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:39

___

### fabricScoped

• **fabricScoped**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:36

___

### fixed

• **fixed**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:35

___

### id

• **id**: [`AttributeId`](../modules/internal_.md#attributeid)

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:27

___

### isConditional

• **isConditional**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:40

___

### mandatoryIf

• **mandatoryIf**: [`ConditionalFeatureList`](../modules/internal_.md#conditionalfeaturelist)\<`F`\>

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:42

___

### omitChanges

• **omitChanges**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:37

___

### optional

• **optional**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:29

___

### optionalIf

• **optionalIf**: [`ConditionalFeatureList`](../modules/internal_.md#conditionalfeaturelist)\<`F`\>

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:41

___

### persistent

• **persistent**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:33

___

### readAcl

• **readAcl**: [`AccessLevel`](../enums/internal_.AccessLevel.md)

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:30

___

### scene

• **scene**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:32

___

### schema

• **schema**: [`TlvSchema`](../classes/internal_.TlvSchema.md)\<`T`\>

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:28

___

### timed

• **timed**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:34

___

### unknown

• **unknown**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:43

___

### writable

• **writable**: `boolean`

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:31

___

### writeAcl

• `Optional` **writeAcl**: [`AccessLevel`](../enums/internal_.AccessLevel.md)

#### Defined in

matter.js/dist/esm/cluster/Cluster.d.ts:38
