import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', col => col.autoIncrement().primaryKey())
    .addColumn('email', 'varchar', col => col.notNull())
    .addColumn('password', 'varchar', col => col.notNull())
    .addColumn('image', 'varchar')
    .execute()

  await db.schema
    .createTable('plants')
    .addColumn('id', 'serial', col => col.autoIncrement().primaryKey())
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('image', 'varchar')
    .addColumn('user_id', 'bigint', col => col.references('users.id'))
    .addColumn('is_private', 'boolean', col => col.defaultTo(true))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users')
    .execute()
  await db.schema.dropTable('plants')
    .execute()
}