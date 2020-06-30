import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('fotos', (table: Knex.CreateTableBuilder) => {
    table.uuid('id').primary().unique()
    table.string('name')
    table.integer('size')
    table.string('key').unique()
    table.string('url')

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at')
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('fotos')
}
