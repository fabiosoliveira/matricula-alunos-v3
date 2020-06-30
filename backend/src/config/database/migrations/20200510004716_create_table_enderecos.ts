import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('enderecos', (table: Knex.CreateTableBuilder) => {
    table.uuid('id').primary().unique()
    table.string('rua', 255).notNullable()
    table.string('bairro', 10).notNullable()
    table.string('cep', 10)
    table.string('cidade', 10).notNullable()
    table.string('endereco', 255).unique()

    table.timestamps(true, true)
    table.timestamp('deleted_at')
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('enderecos')
}
