[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [environment/export](../modules/environment_export.md) / [Environmental](../modules/environment_export.Environmental.md) / ServiceEvents

# Interface: ServiceEvents\<T\>

[environment/export](../modules/environment_export.md).[Environmental](../modules/environment_export.Environmental.md).ServiceEvents

Events related to service lifecycle.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends (...`args`: `any`[]) => `T` |

## Table of contents

### Properties

- [added](environment_export.Environmental.ServiceEvents.md#added)
- [deleted](environment_export.Environmental.ServiceEvents.md#deleted)

## Properties

### added

• **added**: [`Observable`](util_export.Observable.md)\<[instance: InstanceType\<T\>], `void`\>

#### Defined in

[packages/matter.js/src/environment/Environmental.ts:57](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/environment/Environmental.ts#L57)

___

### deleted

• **deleted**: [`Observable`](util_export.Observable.md)\<[instance: InstanceType\<T\>], `void`\>

#### Defined in

[packages/matter.js/src/environment/Environmental.ts:58](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/environment/Environmental.ts#L58)
