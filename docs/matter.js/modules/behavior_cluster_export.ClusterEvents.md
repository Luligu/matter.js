[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [behavior/cluster/export](behavior_cluster_export.md) / ClusterEvents

# Namespace: ClusterEvents

[behavior/cluster/export](behavior_cluster_export.md).ClusterEvents

## Table of contents

### Type Aliases

- [AttributeObservable](behavior_cluster_export.ClusterEvents.md#attributeobservable)
- [AttributeObservables](behavior_cluster_export.ClusterEvents.md#attributeobservables)
- [EventObservable](behavior_cluster_export.ClusterEvents.md#eventobservable)
- [EventObservables](behavior_cluster_export.ClusterEvents.md#eventobservables)
- [Properties](behavior_cluster_export.ClusterEvents.md#properties)
- [Type](behavior_cluster_export.ClusterEvents.md#type)

## Type Aliases

### AttributeObservable

Ƭ **AttributeObservable**\<`A`\>: [`AsyncObservable`](../interfaces/util_export.AsyncObservable.md)\<[value: TypeFromSchema\<A["schema"]\>, oldValue: TypeFromSchema\<A["schema"]\>, context: ActionContext]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`Attribute`](cluster_export.ClusterType.md#attribute) = [`Attribute`](cluster_export.ClusterType.md#attribute) |

#### Defined in

[packages/matter.js/src/behavior/cluster/ClusterEvents.ts:53](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/behavior/cluster/ClusterEvents.ts#L53)

___

### AttributeObservables

Ƭ **AttributeObservables**\<`A`, `N`\>: \{ [K in keyof A as string extends K ? never : K extends string ? A[K] extends Object ? never : \`$\{K}$$\{N}\` : never]: AttributeObservable\<A[K]\> } & \{ [K in keyof A as string extends K ? never : K extends string ? A[K] extends Object ? \`$\{K}$$\{N}\` : never : never]?: AttributeObservable\<A[K]\> }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends `Record`\<`string`, [`Attribute`](cluster_export.ClusterType.md#attribute)\> |
| `N` | extends `string` |

#### Defined in

[packages/matter.js/src/behavior/cluster/ClusterEvents.ts:35](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/behavior/cluster/ClusterEvents.ts#L35)

___

### EventObservable

Ƭ **EventObservable**\<`E`\>: [`Observable`](../interfaces/util_export.Observable.md)\<[payload: TypeFromSchema\<E["schema"]\>, context: ActionContext]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends [`Event`](cluster_export.ClusterType.md#event) = [`Event`](cluster_export.ClusterType.md#event) |

#### Defined in

[packages/matter.js/src/behavior/cluster/ClusterEvents.ts:75](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/behavior/cluster/ClusterEvents.ts#L75)

___

### EventObservables

Ƭ **EventObservables**\<`E`\>: \{ [K in keyof E as string extends K ? never : K extends string ? E[K] extends Object ? never : K : never]: EventObservable\<E[K]\> } & \{ [K in keyof E as string extends K ? never : K extends string ? E[K] extends Object ? K : never : never]?: EventObservable\<E[K]\> }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `Record`\<`string`, [`Event`](cluster_export.ClusterType.md#event)\> |

#### Defined in

[packages/matter.js/src/behavior/cluster/ClusterEvents.ts:57](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/behavior/cluster/ClusterEvents.ts#L57)

___

### Properties

Ƭ **Properties**\<`C`\>: [`AttributeObservables`](behavior_cluster_export.ClusterEvents.md#attributeobservables)\<[`AttributesOf`](cluster_export.ClusterType.md#attributesof)\<`C`\>, ``"Changing"``\> & [`AttributeObservables`](behavior_cluster_export.ClusterEvents.md#attributeobservables)\<[`AttributesOf`](cluster_export.ClusterType.md#attributesof)\<`C`\>, ``"Changed"``\> & [`EventObservables`](behavior_cluster_export.ClusterEvents.md#eventobservables)\<[`EventsOf`](cluster_export.ClusterType.md#eventsof)\<`C`\>\>

Properties the cluster contributes to Events.

#### Type parameters

| Name |
| :------ |
| `C` |

#### Defined in

[packages/matter.js/src/behavior/cluster/ClusterEvents.ts:31](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/behavior/cluster/ClusterEvents.ts#L31)

___

### Type

Ƭ **Type**\<`C`, `B`\>: () => [`ClusterEvents`](behavior_cluster_export.md#clusterevents)\<`C`, `B`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`ClusterType`](../interfaces/cluster_export.ClusterType-1.md) |
| `B` | extends [`Type`](../interfaces/behavior_export.Behavior.Type.md) |

#### Type declaration

• **new Type**(): [`ClusterEvents`](behavior_cluster_export.md#clusterevents)\<`C`, `B`\>

##### Returns

[`ClusterEvents`](behavior_cluster_export.md#clusterevents)\<`C`, `B`\>

#### Defined in

[packages/matter.js/src/behavior/cluster/ClusterEvents.ts:24](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/behavior/cluster/ClusterEvents.ts#L24)
