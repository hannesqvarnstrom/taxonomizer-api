import fs from 'fs'
import path from 'path'

export const main = async (model: string, table: string) => {
    console.log('Creating model with the name ', model)
    const template = `
import {
    JSONSchema,
    Model,
} from "objection";
import knex from './index'

export class ${model} extends Model {
    id!: number

    static tableName = '${table}'

    // this is apparently used mostly for validation purposes.
    static jsonSchema: JSONSchema = {
        type: 'object',
        required: [''],

        properties: {
            id: { type: 'integer' },
        },
    }
}
` 
    const modelsPath = `${path.join('src/models', model)}.ts`
    
    if (fs.existsSync(modelsPath)) {
        throw new Error('Model already exists.')
    }

    await fs.promises.writeFile(modelsPath, template)
}
