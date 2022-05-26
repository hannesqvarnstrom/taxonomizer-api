import { Model } from "objection";
import knex from '../knex'
import { User } from "./User";
import { Plant } from './Plant'

Model.knex(knex)
export default knex
// look here: https://github.com/Vincit/objection.js/blob/master/examples/koa-ts/models/Person.ts

export {
    User,
    Plant,
}

