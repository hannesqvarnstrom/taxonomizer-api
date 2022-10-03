import { Knex } from "knex";
import { User } from "../models";

export default class UsersService {

    constructor() { }

    findByEmail(email: string) {
        return User.query().where('email', email.trim()).first()
    }

    create = (userArgs: { email: string, password: string, image?: string }) => {
        return User.query().insert(userArgs)
    }
}