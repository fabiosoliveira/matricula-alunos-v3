import * as Knex from 'knex'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

const quizesJson = fs.readFileSync(
  path.join(__dirname, 'quizes.json'),
  { encoding: 'utf8', flag: 'r' }
)

const quizes = JSON.parse(quizesJson)

const newQuizes = quizes.map((quiz: object) => ({
  quiz: { ...quiz },
  id: uuidv4()
}))

export async function seed (knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('quizes').del()
    .then(() => {
      // Inserts seed entries
      return knex('quizes').insert(newQuizes)
    })
};
