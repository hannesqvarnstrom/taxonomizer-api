import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', t => {
		t.increments('id').primary()
		t.string('email').unique()
		t.string('password').notNullable()
		t.string('image').nullable()
	})
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users')
}

