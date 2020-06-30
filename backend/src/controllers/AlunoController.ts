/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status-codes'

import knex from '../config/database'
import { v4 as uuidv4 } from 'uuid'

export default {
  // get
  async findAll (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { page = '1', limit = '10' } = req.query

      const limitParam = parseInt(limit as string)
      const pageParam = parseInt(page as string)

      const skip = (pageParam - 1) * limitParam

      const alunos = await knex('alunos')
        .select()
        .whereNull('deleted_at')
        .limit(limitParam)
        .offset(skip)

      const [count] = await knex('alunos').whereNull('deleted_at').count()

      res.header('X-Total-Count', count.count)

      return res.json(alunos)
    } catch (error) {
      next(error)
    }
  },

  // get
  async findById (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const [aluno] = await knex('alunos')
        .select()
        .whereNull('deleted_at')
        .where({ id })

      if (!aluno) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Aluno not found.' })
      }

      return res.json(aluno)
    } catch (error) {
      next(error)
    }
  },

  // post
  async save (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {
        nome,
        dataNascimento,
        cor,
        genero,
        telefone,
        sus_numero,
        cpf_numero,
        status,
        rg_numero_registro,
        rg_data_espedicao,
        rg_emissor,
        rg_nome_pai,
        rg_nome_mae,
        endereco_id,
        responsavel_id,
        foto_id,
        quiz_id
      } = req.body

      const id = uuidv4()

      await knex('alunos')
        .insert({
          id,
          nome,
          dataNascimento,
          cor,
          genero,
          telefone,
          sus_numero,
          cpf_numero,
          status,
          rg_numero_registro,
          rg_data_espedicao,
          rg_emissor,
          rg_nome_pai,
          rg_nome_mae,
          endereco_id,
          responsavel_id,
          foto_id,
          quiz_id
        })

      const [alunoCreated] = await knex('alunos')
        .select()
        .where({ id })

      return res.status(httpStatus.CREATED).json(alunoCreated)
    } catch (error) {
      next(error)
    }
  },

  // put
  async replace (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {
        nome,
        dataNascimento,
        cor,
        genero,
        telefone,
        sus_numero,
        cpf_numero,
        status,
        rg_numero_registro,
        rg_data_espedicao,
        rg_emissor,
        rg_nome_pai,
        rg_nome_mae,
        endereco_id,
        responsavel_id,
        foto_id,
        quiz_id
      } = req.body

      const { id } = req.params

      await knex('alunos')
        .update({
          id,
          nome,
          dataNascimento,
          cor,
          genero,
          telefone,
          sus_numero,
          cpf_numero,
          status,
          rg_numero_registro,
          rg_data_espedicao,
          rg_emissor,
          rg_nome_pai,
          rg_nome_mae,
          endereco_id,
          responsavel_id,
          foto_id,
          quiz_id
        })
        .where({ id })
        .update('updated_at', new Date())

      const [aluno] = await knex('alunos')
        .select()
        .whereNull('deleted_at')
        .where({ id })

      if (!aluno) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: 'Aluno not found.' })
      }

      return res.json(aluno)
    } catch (error) {
      next(error)
    }
  },

  // del
  async delete (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const deleted = await knex('alunos')
        .whereNull('deleted_at')
        .where({ id })
        .del()

      if (!deleted) {
        throw new Error('Aluno delete error')
      }

      return res.sendStatus(httpStatus.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}
