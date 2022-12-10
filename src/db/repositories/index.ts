import { Selectable, SelectQueryBuilder } from "kysely"
import { WhereGrouper } from "kysely/dist/cjs/parser/filter-parser"
import { ID } from "../../services/plants.service"
import db, { Database } from ".."
import { ModelBase, Plant, User } from "@src/models"

export interface IRepository<M extends ModelBase<any, any>> {
    get(arg0?: WhereGrouper<Database, M['tableName']>): Promise<Selectable<M['table']>[] | undefined>
    create(args: M['createArgs']): Promise<Selectable<M['table']> | undefined>
    update(id: ID, args: Partial<M['createArgs']>): Promise<Selectable<M['table']> | undefined>
}

export class Repository<TableName extends keyof Database>{
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
