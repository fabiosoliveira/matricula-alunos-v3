import * as Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('alunos', (table: Knex.CreateTableBuilder) => {
    table.uuid('id').primary().unique()
    table.string('nome', 80).notNullable() // 80 - 3
    table.date('dataNascimento').notNullable() // "Campo `{PATH}` é obrigatório"
    table.enu('cor', ['BRANCO', 'PARDO', 'NEGRO']).notNullable()
    table.enu('genero', ['MASCULINO', 'FEMININO']).notNullable()
    table.string('telefone', 15)
    table.string('sus_numero', 15).notNullable().unique()
    table.string('cpf_numero', 14).notNullable().unique()
    table.enu('status', ['ATIVO', 'INATIVO', 'MATRICULADO']).notNullable()
    table.string('rg_numero_registro', 14) // "Tamanho do `{PATH}` é 10"
    table.date('rg_data_espedicao')
    table.string('rg_emissor', 7)
    table.string('rg_nome_pai', 80) // max:80 min:3
    table.string('rg_nome_mae', 80) // max:80 min:3

    table.uuid('endereco_id')
    table.uuid('responsavel_id')
    table.uuid('foto_id')
    table.uuid('quiz_id')

    // chave estrangeira endereco
    table.foreign('endereco_id')
      .references('enderecos.id')
      .onDelete('SET NULL')

    // chave estrangeira responsável
    table.foreign('responsavel_id')
      .references('responsaveis.id')
      .onDelete('SET NULL')

    // chave estrangeira foto
    table.foreign('foto_id')
      .references('fotos.id')
      .onDelete('SET NULL')

    // chave estrangeira quiz
    table.foreign('quiz_id')
      .references('quizes.id')
      .onDelete('CASCADE')

    table.timestamps(true, true)
    table.timestamp('deleted_at')
  })
}

export async function down (knex: Knex): Promise<any> {
  return knex.schema.dropTable('alunos')
}
