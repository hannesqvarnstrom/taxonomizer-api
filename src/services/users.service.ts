import { Knex } from "knex";
import { User, UserRespository } from "../models";

export default class UsersService {
    constructor() { }
    findByEmail(email: string) {
      return UserRespository.getByEmail(email.trim())
    }

    create = (userArgs: { email: string, password: string, image?: string }) => {
        return UserRespository.create(userArgs)
    }
}