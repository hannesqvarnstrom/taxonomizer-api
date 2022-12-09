
import { Generated, ColumnType, Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import * as Cursor from 'pg-cursor'
interface UsersTable extends TableBase {
  email: string
  password: string // ?
  image: string | null
}

interface PlantsTable extends TableBase {
  name: string
  image: string | null
  user_id: number
  is_private: boolean
}

export interface Database {
  users: UsersTable,
  plants: PlantsTable
}

interface TableBase {
  readonly id: Generated<number>
}

export default new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST ?? 'localhost',
      database: process.env.DB_NAME
    })
  })
})