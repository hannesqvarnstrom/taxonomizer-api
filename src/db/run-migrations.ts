import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'
import {Database} from '.'
import config from '../../knexfile'
async function migrateToLatest() {
  const dbName = process.env.NODE_ENV !== 'testing'
    ? process.env.DB_NAME
    : process.env.TEST_DB_NAME

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: 'localhost',
        database: dbName
      })
    })
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs, path, migrationFolder: 'migrations'
    })
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully!`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()