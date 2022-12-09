
// import {
//     JSONSchema,
//     Model,
//     QueryBuilder,
//     RelationMappings,
//     RelationMappingsThunk,
// } from "objection";
// import { Plant } from "./Plant";

// export class User extends Model {
//     id!: number
//     email!: string
//     password!: string
//     image: string | null

//     static tableName = 'users'

//     static jsonSchema: JSONSchema = {
//         type: 'object',
//         required: ['email'],

//         properties: {
//             id: { type: 'integer' },
//             email: { type: 'string' },
//             password: { type: 'string' },
//             image: { type: ['string', 'null'] },
//         },
//     }

//     static get relationMappings(): RelationMappings | RelationMappingsThunk {
//       return {
//         plants: {
//           relation: Model.HasManyRelation,
//           modelClass: Plant,
//           join: {
//             from: 'users.id',
//             to: 'plants.user_id'
//           }
//         }
//       }
//     }
// }
