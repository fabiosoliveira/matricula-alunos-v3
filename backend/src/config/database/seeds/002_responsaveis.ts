import * as Knex from 'knex'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

const responsaveisJson = fs.readFileSync(
  path.join(__dirname, 'responsaveis.json'),
  { encoding: 'utf8', flag: 'r' }
)

const responsaveis = JSON.parse(responsaveisJson)

const newResponsaveis = responsaveis.map((responsavel: object) => ({
  ...responsavel,
  id: uuidv4()
}))

export async function seed (knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('responsaveis').del()
    .then(() => {
      // Inserts seed entries
      return knex('responsaveis').insert(newResponsaveis)
    })
};
