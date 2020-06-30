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

      const quizes = await knex('quizes')
        .select()
        .limit(limitParam)
        .offset(skip)

      const [count] = await knex('quizes').count()

      res.header('X-Total-Count', count.count)

      return res.json(quizes)
    } catch (error) {
      next(error)
    }
  },

  // get
  async findById (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const [quiz] = await knex('quizes')
        .select()
        .where({ id })

      if (!quiz) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Quiz not found.' })
      }

      return res.json(quiz)
    } catch (error) {
      next(error)
    }
  },

  // post
  async save (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {
        onibusEscolar,
        necessidadeEspecial,
        tratamentoEspecial,
        algumaAlergia,
        algumMedicamentoContinuado,
        procedimentoEscolar
      } = req.body

      const id = uuidv4()

      await knex('quizes')
        .insert({
          id,
          quiz: {
            onibusEscolar,
            necessidadeEspecial,
            tratamentoEspecial,
            algumaAlergia,
            algumMedicamentoContinuado,
            procedimentoEscolar
          }
        })

      const [quizCreated] = await knex('quizes')
        .select()
        .where({ id })

      return res.status(httpStatus.CREATED).json(quizCreated)
    } catch (error) {
      next(error)
    }
  },

  // put
  async replace (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {
        onibusEscolar,
        necessidadeEspecial,
        tratamentoEspecial,
        algumaAlergia,
        algumMedicamentoContinuado,
        procedimentoEscolar
      } = req.body

      const { id } = req.params

      await knex('quizes')
        .update({
          id,
          quiz: {
            onibusEscolar,
            necessidadeEspecial,
            tratamentoEspecial,
            algumaAlergia,
            algumMedicamentoContinuado,
            procedimentoEscolar
          }
        })
        .where({ id })
        .update('updated_at', new Date())

      const [_quiz] = await knex('quizes')
        .select()
        .where({ id })

      if (!_quiz) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: 'Quiz not found.' })
      }

      return res.json(_quiz)
    } catch (error) {
      next(error)
    }
  },

  // del
  async delete (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const deleted = await knex('quizes')
        .where({ id })
        .del()

      if (!deleted) {
        throw new Error('Quiz delete error')
      }

      return res.sendStatus(httpStatus.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}
