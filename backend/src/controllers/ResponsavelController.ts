/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status-codes'

import knex from '../config/database'
import { v4 as uuidv4 } from 'uuid'
import isNullOrWhiteSpace from '../utils/isNullOrWhiteSpace'

export default {
  // get
  async findAll (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { page = '1', limit = '10', select, search = '', orderBy, orderDirection = 'asc' } = req.query

      const limitParam = parseInt(limit as string)
      const pageParam = parseInt(page as string)

      const skip = (pageParam - 1) * limitParam

      const queryFactory = () => {
        const query = knex.from('responsaveis')
          .whereNull('deleted_at')

        const searchParam = String(search).toLocaleLowerCase()

        if (!isNullOrWhiteSpace(searchParam)) {
          query
            .where(
              knex.raw('LOWER("nome") like ?', `%${searchParam}%`)
            )
            .orWhere(
              knex.raw('LOWER("parentesco") like ?', `%${searchParam}%`)
            )
            .orWhere(
              knex.raw('LOWER("cpf_numero") like ?', `%${searchParam}%`)
            )
            .orWhere(
              knex.raw('LOWER("rg_numero_registro") like ?', `%${searchParam}%`)
            )
            // .orWhere(
            //   knex.raw('LOWER("rg_data_espedicao") like ?', `%${searchParam}%`)
            // )
            // .orWhere(
            //   knex.raw('LOWER("rg_emissor") like ?', `%${searchParam}%`)
            // )
            // .orWhere(
            //   knex.raw('LOWER("rg_nome_pai") like ?', `%${searchParam}%`)
            // )
            // .orWhere(
            //   knex.raw('LOWER("rg_nome_mae") like ?', `%${searchParam}%`)
            // )
        }

        return query
      }

      const query = queryFactory()

      if (orderBy) {
        query.orderBy(String(orderBy), String(orderDirection))
      }

      if (select) {
        const selectFilds = String(select).split(',').map(fild => fild.trim())
        selectFilds.forEach(fild => query.select(fild))
      }

      const responsaveis = await query.limit(limitParam).offset(skip)

      const [count] = await queryFactory().count()

      res.header('Access-Control-Expose-Headers', 'X-Total-Count')
      res.header('X-Total-Count', count.count)

      return res.json(responsaveis)
    } catch (error) {
      next(error)
    }
  },

  // get
  async findById (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const [responsavel] = await knex('responsaveis')
        .select()
        .whereNull('deleted_at')
        .where({ id })

      if (!responsavel) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Responsável not found.' })
      }

      return res.json(responsavel)
    } catch (error) {
      next(error)
    }
  },

  // post
  async save (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {
        nome,
        parentesco,
        cpf_numero,
        rg_numero_registro,
        rg_data_espedicao,
        rg_emissor,
        rg_nome_pai,
        rg_nome_mae
      } = req.body

      const id = uuidv4()

      await knex('responsaveis')
        .insert({
          id,
          nome,
          parentesco,
          cpf_numero,
          rg_numero_registro,
          rg_data_espedicao,
          rg_emissor,
          rg_nome_pai,
          rg_nome_mae
        })

      const [responsavelCreated] = await knex('responsaveis')
        .select()
        .where({ id })

      return res.status(httpStatus.CREATED).json(responsavelCreated)
    } catch (error) {
      next(error)
    }
  },

  // put
  async replace (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {
        nome,
        parentesco,
        cpf_numero,
        rg_numero_registro,
        rg_data_espedicao,
        rg_emissor,
        rg_nome_pai,
        rg_nome_mae
      } = req.body

      const { id } = req.params

      await knex('responsaveis')
        .update({
          id,
          nome,
          parentesco,
          cpf_numero,
          rg_numero_registro,
          rg_data_espedicao,
          rg_emissor,
          rg_nome_pai,
          rg_nome_mae
        })
        .where({ id })
        .update('updated_at', new Date())

      const [responsavel] = await knex('responsaveis')
        .select()
        .whereNull('deleted_at')
        .where({ id })

      if (!responsavel) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: 'Responsável not found.' })
      }

      return res.json(responsavel)
    } catch (error) {
      next(error)
    }
  },

  // del
  async delete (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const deleted = await knex('responsaveis')
        .whereNull('deleted_at')
        .where({ id })
        .update('deleted_at', new Date())
        // .del()

      if (!deleted) {
        throw new Error('Responsável delete error')
      }

      return res.sendStatus(httpStatus.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}
