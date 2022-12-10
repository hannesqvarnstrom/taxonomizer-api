import { User } from "@src/models"
import { ID } from "@src/services/plants.service"
import { WhereGrouper } from "kysely/dist/cjs/parser/filter-parser"
import { IRepository, Repository } from "."
import { Database } from ".."

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
