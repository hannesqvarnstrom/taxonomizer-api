import { Kysely, Selectable, SelectQueryBuilder, Updateable } from 'kysely';

import { From } from 'kysely/dist/cjs/parser/table-parser';
import { WhereGrouper } from 'kysely/dist/cjs/parser/filter-parser';
import db, { Database } from '../db';
import { SelectAllQueryBuilder } from 'kysely/dist/cjs/parser/select-parser';
import { ID } from '../services/plants.service';


export abstract class ModelBase<CreateArgs, Table extends Database[keyof Database]>{
  table: Table
  createArgs: CreateArgs
  tableName: keyof Database
}

export class User extends ModelBase<{
  email: string
  password: string
  image?: string
}, Database['users']>
{
  tableName: 'users'
}

export class Plant extends ModelBase<
  {
    name: string
    user_id: number
    image?: string
    is_private?: boolean
  }, Database['plants']
> {
  tableName: 'plants'
}
