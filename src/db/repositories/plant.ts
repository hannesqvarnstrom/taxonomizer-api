import { Plant } from "@src/models"
import { ID } from "@src/services/plants.service"
import { SelectQueryBuilder } from "kysely"
import { WhereGrouper } from "kysely/dist/cjs/parser/filter-parser"
import { IRepository, Repository } from "."
import db, { Database } from ".."

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

    create(args: { name: string; user_id: number; image?: string; is_private: boolean; }) {
        const creationArgs = { ...args }
        return db.insertInto('plants').values(creationArgs).returningAll().executeTakeFirst()
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

        if (opts?.owned && user_id) {
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