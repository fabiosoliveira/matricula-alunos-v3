import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('quizes', (table: Knex.CreateTableBuilder) => {
    table.uuid('id').primary().unique()
    table.jsonb('quiz')

    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('quizes')
}
