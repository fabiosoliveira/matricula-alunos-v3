/* eslint-disable @typescript-eslint/camelcase */
import * as Knex from 'knex'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

const alunosJson = fs.readFileSync(
  path.join(__dirname, 'alunos.json'),
  { encoding: 'utf8', flag: 'r' }
)

const alunos = JSON.parse(alunosJson)

export async function seed (knex: Knex): Promise<any> {
  const enderecos = await knex('enderecos').select()
  const responsaveis = await knex('responsaveis').select()
  const quizes = await knex('quizes').select()

  const newAlunos = alunos.map((aluno: object, index: number) => ({
    ...aluno,
    id: uuidv4(),
    endereco_id: enderecos[index].id,
    responsavel_id: responsaveis[index].id,
    quiz_id: quizes[index].id
  }))

  // Deletes ALL existing entries
  return knex('alunos').del()
    .then(() => {
      // Inserts seed entries
      return knex('alunos').insert(newAlunos)
    })
};
