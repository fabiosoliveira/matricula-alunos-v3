import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status-codes'

import knex from '../config/database'
import isNullOrWhiteSpace from '../utils/isNullOrWhiteSpace'
import { v4 as uuidv4 } from 'uuid'

export default {

  // get
  async findAll (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { page = '1', limit = '10', select, search = '', orderBy, orderDirection = 'asc' } = req.query

      const limitParam = parseInt(limit as string)
      const pageParam = parseInt(page as string)

      const skip = (pageParam - 1) * limitParam

      const queryFactory = () => {
        const query = knex.from('enderecos')
          .whereNull('deleted_at')

        const searchParam = String(search).toLocaleLowerCase()

        if (!isNullOrWhiteSpace(searchParam)) {
          query
            .where(
              knex.raw('LOWER("rua") like ?', `%${searchParam}%`)
            )
            .orWhere(
              knex.raw('LOWER("bairro") like ?', `%${searchParam}%`)
            )
            .orWhere(
              knex.raw('LOWER("cep") like ?', `%${searchParam}%`)
            )
            .orWhere(
              knex.raw('LOWER("cidade") like ?', `%${searchParam}%`)
            )
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

      const enderecos = await query.limit(limitParam).offset(skip)

      const [count] = await queryFactory().count()

      res.header('Access-Control-Expose-Headers', 'X-Total-Count')
      res.header('X-Total-Count', count.count)

      return res.json(enderecos)
    } catch (error) {
      next(error)
    }
  },

  // get
  async findById (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const [endereco] = await knex('enderecos')
        .select()
        .whereNull('deleted_at')
        .where({ id })

      if (!endereco) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Endereço not found.' })
      }

      return res.json(endereco)
    } catch (error) {
      next(error)
    }
  },

  // post
  async save (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { rua, bairro, cep, cidade } = req.body

      const id = uuidv4()

      await knex('enderecos')
        .insert({
          id,
          rua,
          bairro,
          cep,
          cidade,
          endereco: `${rua}, ${bairro}, ${cidade}`
        })

      const [enderecoCreated] = await knex('enderecos')
        .select()
        .where({ id })

      return res.status(httpStatus.CREATED).json(enderecoCreated)
    } catch (error) {
      next(error)
    }
  },

  // put
  async replace (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { rua, bairro, cep, cidade } = req.body

      const { id } = req.params

      await knex('enderecos')
        .update({
          id,
          rua,
          bairro,
          cep,
          cidade,
          endereco: `${rua}, ${bairro}, ${cidade}`
        })
        .where({ id })
        .update('updated_at', new Date())

      const [endereco] = await knex('enderecos')
        .select()
        .whereNull('deleted_at')
        .where({ id })

      if (!endereco) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: 'Endereço not found.' })
      }

      return res.json(endereco)
    } catch (error) {
      next(error)
    }
  },

  // del
  async delete (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const deleted = await knex('enderecos')
        .whereNull('deleted_at')
        .where({ id })
        .del()

      if (!deleted) {
        throw new Error('Endereço delete error')
      }

      return res.sendStatus(httpStatus.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}
