import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', t => {
    t.index('email', 'users_email_index')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', t => {
    t.dropIndex('users_email_index')
  })
}

