import * as Knex from 'knex'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

const enderecosJson = fs.readFileSync(
  path.join(__dirname, 'enderecos.json'),
  { encoding: 'utf8', flag: 'r' }
)

const enderecos = JSON.parse(enderecosJson)

const newEnderecos = enderecos.map((endereco: object) => ({
  ...endereco,
  id: uuidv4()
}))

export async function seed (knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('enderecos').del()
    .then(() => {
      // Inserts seed entries
      return knex('enderecos').insert(newEnderecos)
    })
};
