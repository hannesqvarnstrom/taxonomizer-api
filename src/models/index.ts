import { Kysely, Selectable, SelectQueryBuilder, Updateable } from 'kysely';

import { From } from 'kysely/dist/cjs/parser/table-parser';
import { WhereGrouper } from 'kysely/dist/cjs/parser/filter-parser';
import db, { Database } from '../db';
import { SelectAllQueryBuilder } from 'kysely/dist/cjs/parser/select-parser';
import { ID } from '../services/plants.service';
export {
  User,
  Plant,
}

abstract class ModelBase<CreateArgs, Table extends Database[keyof Database]>{
  table: Table
  createArgs: CreateArgs
  tableName: keyof Database
}

class User extends ModelBase<{
  email: string
  password: string
  image?: string
}, Database['users']>
{
  tableName: 'users'
}

class Plant extends ModelBase<
  {
    name: string
    user_id: number
    image?: string
    is_private?: boolean
  }, Database['plants']
> {
  tableName: 'plants'
}

interface IRepository<M extends ModelBase<any, any>> {
  get(arg0?: WhereGrouper<Database, M['tableName']>): Promise<Selectable<M['table']>[]>
  create(args: M['createArgs']): Promise<Selectable<M['table']>>
  update(id: ID, args: Partial<M['createArgs']>): Promise<Selectable<M['table']>>
}

const tables = [
  'users',
  'plants'
]
// abstract class Repository {
//   tableName: keyof {[S in keyof Database]: Database[S]}
//   constructor(tableName?: keyof Database) {
//     this.tableName = tableName
//   }

//   async get(...args: any) {
//     if (this.tableName in tables) {
//       return db.selectFrom(this.tableName).selectAll().execute()
//     }
//   }
// }

// const RepositoryQueries = {
//   get: 
// }

class Repository<TableName extends keyof Database>{
  constructor(public readonly table: TableName) { }

  protected selectQuery() {
    return db.selectFrom(this.table)
  }

  protected updateQuery() {
    return db.updateTable(this.table)
  }

  protected insertQuery() {
    return db.insertInto(this.table)
  }

  protected deleteQuery() {
    return db.deleteFrom(this.table)
  }
}

class CUserRespository extends Repository<'users'> implements IRepository<User> {
  constructor() {
    super('users')
  }

  async get(where?: WhereGrouper<Database, 'users'>) {
    const q = this.selectQuery().selectAll()
    if (where) {
      q.where(where)
    }

    return q.execute()
  }

  getByEmail(email: string) {
    return this.selectQuery()
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst()
  }

  async create(args: { email: string; password: string; image?: string; }) {
    const user = await this.insertQuery()
      .values({
        email: args.email,
        password: args.password,

      })
      .returningAll()
      .executeTakeFirst()

    return user
  }

  async update(id: ID, args: Partial<{ email: string; password: string; image?: string; }>) {
    return this.updateQuery()
      .where('id', '=', Number(id))
      .set(args)
      .returningAll()
      .executeTakeFirst()
  }
}
export const UserRespository = new CUserRespository()

interface PlantQueryOpts {
  owned: boolean
}

class CPlantRepository extends Repository<'plants'> implements IRepository<Plant> {
  constructor() {
    super('plants')
  }

  get(where?: WhereGrouper<Database, 'plants'>) {
    const q = db.selectFrom('plants').selectAll()
    if (where) {
      q.where(where)
    }

    return q.execute()
  }

  create(args: { name: string; user_id: number; image?: string; is_private?: boolean; }) {
    return db.insertInto('plants').values(args).returningAll().executeTakeFirst()
  }

  async update(id: ID, args: Partial<{ email: string; password: string; image?: string; }>) {
    return this.updateQuery()
      .where('id', '=', Number(id))
      .set(args)
      .returningAll()
      .executeTakeFirst()
  }

  getWherePublicOrOwned(qb: SelectQueryBuilder<Database, 'plants', {}>, user_id: ID) {
    return qb
      .where('is_private', '=', false)
      .orWhere('user_id', '=', Number(user_id))
  }

  getWhereOwned(qb: SelectQueryBuilder<Database, 'plants', {}>, user_id: ID) {
    return qb.where('user_id', '=', Number(user_id))
  }

  findById(id: ID, user_id?: ID, opts?: PlantQueryOpts) {
    let qb = this.selectQuery().selectAll().where('id', '=', Number(id))

    if (opts?.owned) {
      this.getWhereOwned(qb, user_id)
    } else if (user_id) {
      this.getWherePublicOrOwned(qb, user_id)
    } else {
      this.getPublic(qb)
    }

    return qb.executeTakeFirst()
  }

  selectQuery() {
    return db.selectFrom('plants')
  }

  getViewable(user_id: ID) {
    return this.getWherePublicOrOwned(this.selectQuery().selectAll(), user_id)
  }

  getPublic(qb: SelectQueryBuilder<Database, 'plants', {}>) {
    return qb.where('is_private', '=', false)
  }

  deleteById(id: ID) {
    return this.deleteQuery().where('id', '=', Number(id))
  }
}

export const PlantRepository = new CPlantRepository()