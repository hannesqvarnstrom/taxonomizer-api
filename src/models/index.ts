import { Kysely, Selectable, SelectQueryBuilder } from 'kysely';

import { From } from 'kysely/dist/cjs/parser/table-parser';
import { WhereGrouper } from 'kysely/dist/cjs/parser/filter-parser';
import db, { Database } from '../db';
import { SelectAllQueryBuilder } from 'kysely/dist/cjs/parser/select-parser';
import { ID } from '../services/plants.service';
export {
  User,
  Plant,
}

abstract class ModelBase<CreateArgs>{
  table: Database[keyof Database]
  createArgs: CreateArgs
  tableName: string & keyof Database
}

class User extends ModelBase<{
  email: string
  password: string
  image?: string
}>
{
  table: Database['users']
  tableName: 'users'
}

class Plant extends ModelBase<
  {
    name: string
    user_id: number
    image?: string
    is_private?: boolean
  }
> {
  table: Database['plants']
  tableName: 'plants'
}

interface IRepository<M extends ModelBase<any>> {
  get(arg0?: WhereGrouper<Database, M['tableName']>): Promise<Selectable<M['table']>[]>
  create(args: M['createArgs']): Promise<Selectable<M['table']>>
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

class UserRespository implements IRepository<User> {
  async get(where?: WhereGrouper<Database, 'users'>) {
    const q = db.selectFrom('users').selectAll()
    if (where) {
      q.where(where)
    }

    return q.execute()
  }

  async create(args: { email: string; password: string; image?: string; }) {
    const user = await db.insertInto('users').values({
      email: args.email,
      password: args.password,

    })
      .returningAll()
      .executeTakeFirst()

    return user
  }
}

(async () => {
  const r = new UserRespository()

  const x = await r.get(where => where.where('image', '=', null))
  x.forEach(x2 => {
    if (x2.email === null) {

    }
  })
})

interface PlantQueryOpts {
  wherePublicOrOwned: boolean
}

class CPlantRepository implements IRepository<Plant> {
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

  getWherePublicOrOwned(qb: SelectQueryBuilder<Database, 'plants', {}>, user_id: number | string) {
    return qb
      .where('is_private', '=', true)
      .orWhere('user_id', '=', Number(user_id))
    // db.selectFrom('plants')
  }

  findById(id: number | string, user_id?: number | string, opts?: PlantQueryOpts) {
    let qb = db.selectFrom('plants').selectAll()
    if (opts.wherePublicOrOwned && user_id) {
      this.getWherePublicOrOwned(qb, user_id)
    }
    return qb.executeTakeFirst()
  }

  getViewable(user_id: ID) {
    return this.getWherePublicOrOwned(db.selectFrom('plants').selectAll(), user_id)
  }
}

export const PlantRepository = new CPlantRepository()