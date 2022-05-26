import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('plants', t => {
		t.increments('id').primary()
		t.string('name').notNullable()
		t.string('image').nullable()
    t.bigInteger('user_id')
    t.boolean('is_private').defaultTo(true)
    t.foreign('user_id').references('users.id')
	})
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('plants')
}

