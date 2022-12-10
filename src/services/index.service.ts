import { Knex } from "knex";
import knex from "../knex";
import PlantsService from "./plants.service";
import UsersService from "./users.service";


class Services {
    db: Knex.Transaction
    constructor() {
    }

    plantsService = () => new PlantsService()
    usersService = () => new UsersService()
}

export default new Services()
