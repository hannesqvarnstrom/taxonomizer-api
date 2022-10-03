
import {
  JSONSchema,
  Model,
  QueryBuilder,
  RelationMappings,
  RelationMappingsThunk,
} from "objection";
import knex from './index'
import { User } from "./User";

export class Plant extends Model {
  id!: number
  name!: string
  image?: string
  user_id: string | number
  is_private: boolean = false

  static tableName = 'plants'

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name', 'user_id'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      image: { type: ['string', 'null'] },
      user_id: { type: ['string', 'integer'] },
      is_private: { type: 'boolean', default: true },
    },
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'plants.user_id',
          to: 'users.id'
        }
      }
    }
  }

  static wherePublicOrOwned = (userId?: number | string) => {
    const q = Plant.query().where('is_private', false)

    if (userId) {
      q.orWhere('user_id', userId)
    }

    return q
  }

  static bindUserId = (userId: number | string) => {
    return Plant.query().where('user_id', userId)
  }
}
