
import {
    JSONSchema,
    Model,
} from "objection";

export class User extends Model {
    id!: number
    email!: string
    password!: string
    image: string | null

    static tableName = 'users'

    static jsonSchema: JSONSchema = {
        type: 'object',
        required: ['email'],

        properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            password: { type: 'string' },
            image: { type: ['string', 'null'] },
        },
    }
}
