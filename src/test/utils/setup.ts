import { app } from "../../app";
import request from 'supertest'
// const config = require('../../knexfile')[process.env.NODE_ENV]
// const config = require('../../knexfile')[process.env.NODE_ENV]
import knexInstance from '../../knex'
import * as knex from "knex";
import testLog from "./test-log";
export const api = request(app)

class KnexManager {
  knex: knex.Knex
  connected = false
  migrated = false

  constructor(knex: knex.Knex) {
    this.knex = knex
  }

  migrate() {
    if (this.migrated || !this.connected) return
    this.migrated = true
    return this.knex.migrate.latest()
  }


  async truncateAll() {
    if (!this.connected || !this.migrated) return
    const { rows } = await this.knex.raw(`select tablename from pg_tables where tablename not like '%pg%';`)
    const tablenames = rows
      .map((r: { tablename: string }) => r.tablename)
      .filter((name: string) => !name.includes('sql') && !name.startsWith('_') && !name.includes('migrations') && !name.includes('pg_'))
      .join(', ')

    const truncateString = 'truncate ' + tablenames

    return await this.knex.raw(truncateString)
  }

  destroy() {
    if (!this.connected) return
    this.connected = false
    return this.knex.destroy()
  }

  initialize() {
    if (this.connected) return
    this.connected = true
    return this.knex.initialize()
  }
}

export class TestDb {
  manager: KnexManager

  constructor(knexI: knex.Knex) {
    this.manager = new KnexManager(knexI)
  }

  async teardown() {
    await this.manager.truncateAll()
    await this.manager.destroy()
  }

  async setup() {
    await this.manager.initialize()
    return await this.manager.migrate()
  }

  async restart() {
    await this.teardown()
    await this.setup()
    return
  }
}

export const testDb = new TestDb(knexInstance)
/**
 * TEMP!!!! TODO:
 * vad är projektet?
 *
 * en tanke är:
 *
 * låt api-et vara en app
 * appen hanterar växtregister av olika slag
 *
 * sen, man ska kunna hämta ett register som ett skript / en tagg
 * lägga in det i en wordpress sida
 * och därmed få in hela registret rakt upp o ned
 *
 * istället för att behöva länka till en sajt
 *
 * det innebär några olika varianter...
 *
 * 1. serve:a en html-komponent via CDN. skapa en route i heroku-appen som bara har att göra med CDN, som svarar på anrop med ett appskript
 *  som renderar en komponent i en sida. detta kan jag testa på egen hand utan något mer egentligen
 *
 * 2. wordpress plugin som hämtar data specifierad i pluginet.
 *
 * typ
 *
 * pluginet ger en möjlighet att skapa registry-komponenter
 * en registry komponent renderar ett registry
 *
 * man lägger in registry-komponenten i en wordpress-page / post
 * vilket då gör att pagen/posten renderar, genom pluginet (ingen hämtning av data i frontend)
 * , hela komponenten i html-pagen SSR!
 *
 * plugin.index
 * plugin.create-registry-component
 * för att lägga in registry-component i page, använd samma syntax som det andra pluginet som anton använder,
 * det där tabell-pluginet
 *
 * sen får man ha lite php-magi för att bygga upp sidan baserat på pluginets input.
 * den kommer bara kunna göra GET-requests till servern, naturligtvis
 * och kommer göra olika get-requests baserat på pluginets input
 *
 * sen kommer den att bygga upp en tabell-struktur eller VAFAN NÅGOT SÅNT
 *
 * om jag ändå ska bygga en frontend-app för att interagera med servern
 * så kan jag återanvända koden där.
 *
 * det innebär tekniskt sett att jag lika gärna kan bygga något i frontend-appen först.
 *
 * så MVP för att cruda växtregistrys (vad det nu innebär)
 * följt av MVP av Wordpress-koppling.
 *
 */
