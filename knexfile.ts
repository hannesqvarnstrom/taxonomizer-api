import type { Knex } from "knex";
import * as dotenv from 'dotenv'
dotenv.config()
// Update with your config settings.
console.log(process.env)
const config: { [key: string]: Knex.Config } = {
    development: {
        client: "postgresql",
        connection: process.env.DATABASE_URL,
        migrations: {
            tableName: "migrations",
        },
    },

    production: {
        client: "postgresql",
        connection: process.env.DATABASE_URL,
        migrations: {
            tableName: "migrations",
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
};

export default config
