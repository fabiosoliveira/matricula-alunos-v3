import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('responsaveis', (table: Knex.CreateTableBuilder) => {
    table.uuid('id').primary().unique()
    table.string('nome', 80) // max:80 min:3
    table.string('parentesco', 10) // max:10 min:3
    table.string('cpf_numero', 14).unique() // "Tamanho do `{PATH}` é 10"
    table.string('rg_numero_registro', 14) // "Tamanho do `{PATH}` é 10"
    table.date('rg_data_espedicao')
    table.string('rg_emissor', 7)
    table.string('rg_nome_pai', 80) // max:80 min:3
    table.string('rg_nome_mae', 80) // max:80 min:3

    table.timestamps(true, true)
    table.timestamp('deleted_at')
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('responsaveis')
}
