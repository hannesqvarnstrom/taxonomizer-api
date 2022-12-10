import db from "@src/db";
import { Knex } from "knex";
import { Kysely } from "kysely";
import knex from "../knex";
import PlantsService from "./plants.service";
import UsersService from "./users.service";


class Services {
    constructor(public db: Kysely<any>) {
    }

    plantsService = () => new PlantsService()
    usersService = () => new UsersService()
}

export default new Services(db)
