/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { Router, Request, Response, NextFunction } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import multer from 'multer'

import cpfValidator from './validators/cpfValidator'
import cnsValidator from './validators/cnsValidator'

import EnderecoController from './controllers/EnderecoController'
import ResponsavelController from './controllers/ResponsavelController'
import FotoController from './controllers/FotoController'
import QuizController from './controllers/QuizController'
import AlunoController from './controllers/AlunoController'

const router = Router()

const postValidatorEndereco = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().guid({ version: 'uuidv4' }),
    rua: Joi.string().required().min(5),
    bairro: Joi.string().required().min(3).max(10),
    cep: Joi.string().regex(/^[0-9]{2}.[0-9]{3}-[0-9]{3}$/),
    cidade: Joi.string().required().min(3).max(10),
    endereco: Joi.string().min(5)
  })
}, {
  abortEarly: false
})

const paramsValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().guid({ version: 'uuidv4' })
  })
})

const headerValidator = celebrate({
  [Segments.HEADERS]: Joi.object({
    'content-type': Joi.string().required().regex(/application\/json/)
  }).unknown()
})

const pageValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    select: Joi.string(),
    search: Joi.string(),
    orderBy: Joi.string(),
    orderDirection: Joi.string().regex(/^(asc|desc)$/)
  })
})

router
  .get('/enderecos',
    pageValidator,
    EnderecoController.findAll
  )
  .get('/enderecos/:id',
    paramsValidator,
    EnderecoController.findById
  )
  .post('/enderecos',
    headerValidator,
    postValidatorEndereco,
    EnderecoController.save
  )
  .put('/enderecos/:id',
    headerValidator,
    paramsValidator,
    EnderecoController.replace
  )
  .delete('/enderecos/:id',
    paramsValidator,
    EnderecoController.delete
  )

const postValidatorResponsavel = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().guid({ version: 'uuidv4' }),
    nome: Joi.string().min(3).max(80),
    parentesco: Joi.string().min(3).max(10),
    cpf_numero: Joi.string().length(14),
    rg_numero_registro: Joi.string().max(14),
    rg_data_espedicao: Joi.date().iso(), // Joi.string().regex(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/),
    rg_emissor: Joi.string().max(7),
    rg_nome_pai: Joi.string().min(3).max(80),
    rg_nome_mae: Joi.string().min(3).max(80)
  })
}, {
  abortEarly: false
})

const customCpfValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { cpf_numero } = req.body
  if (!cpfValidator(cpf_numero)) {
    throw new Error('"cpf_numero" invalid')
  }
  next()
}

router
  .get('/responsaveis',
    pageValidator,
    ResponsavelController.findAll
  )
  .get('/responsaveis/:id',
    paramsValidator,
    ResponsavelController.findById
  )
  .post('/responsaveis',
    headerValidator,
    postValidatorResponsavel,
    customCpfValidator,
    ResponsavelController.save
  )
  .put('/responsaveis/:id',
    headerValidator,
    paramsValidator,
    ResponsavelController.replace
  )
  .delete('/responsaveis/:id',
    paramsValidator,
    ResponsavelController.delete
  )

const postValidatorFoto = celebrate({
  [Segments.HEADERS]: Joi.object({
    'content-type': Joi.string().required().regex(/multipart\/form-data/)
  }).unknown(),
  [Segments.QUERY]: Joi.object().keys({
    left: Joi.number(),
    top: Joi.number(),
    width: Joi.number(),
    height: Joi.number()
  })
}, {
  abortEarly: false
})

const storage = multer.memoryStorage()
const upload = multer({ storage })
const upFileMiddleware = upload.single('file')

router
  .get('/fotos',
    pageValidator,
    FotoController.findAll
  )
  .post('/fotos',
    postValidatorFoto,
    upFileMiddleware,
    FotoController.save
  )
  .delete('/fotos/:id',
    paramsValidator,
    FotoController.delete
  )

const postValidatorQuiz = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().guid({ version: 'uuidv4' }),
    onibusEscolar: Joi.string().regex(/^(SIM|NAO)$/),
    necessidadeEspecial: Joi.string(),
    tratamentoEspecial: Joi.string(),
    algumaAlergia: Joi.string(),
    algumMedicamentoContinuado: Joi.string(),
    procedimentoEscolar: Joi.string().regex(/^(CHAMAR-RESPONSAVEL|LEVAR-AO-HOSPITAL)$/)
  })
}, {
  abortEarly: false
})

router
  .get('/quizes',
    pageValidator,
    QuizController.findAll
  )
  .get('/quizes/:id',
    paramsValidator,
    QuizController.findById
  )
  .post('/quizes',
    headerValidator,
    postValidatorQuiz,
    QuizController.save
  )
  .put('/quizes/:id',
    headerValidator,
    paramsValidator,
    QuizController.replace
  )
  .delete('/quizes/:id',
    paramsValidator,
    QuizController.delete
  )

const postValidatorAluno = celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().guid({ version: 'uuidv4' }),
    nome: Joi.string().required().min(3).max(80),
    dataNascimento: Joi.date().iso(),
    cor: Joi.string().required().regex(/^(BRANCO|PARDO|NEGRO)$/),
    genero: Joi.string().required().regex(/^(MASCULINO|FEMININO)$/),
    telefone: Joi.string().length(15).regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/),
    sus_numero: Joi.string().required().length(15),
    cpf_numero: Joi.string().required().length(14),
    status: Joi.string().required().regex(/^(ATIVO|INATIVO|MATRICULADO)$/),
    rg_numero_registro: Joi.string().length(14),
    rg_data_espedicao: Joi.date().iso(), // Joi.string().regex(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/),
    rg_emissor: Joi.string().max(7),
    rg_nome_pai: Joi.string().min(3).max(80),
    rg_nome_mae: Joi.string().min(3).max(80),

    endereco_id: Joi.string().guid({ version: 'uuidv4' }),
    responsavel_id: Joi.string().guid({ version: 'uuidv4' }),
    foto_id: Joi.string().guid({ version: 'uuidv4' }),
    quiz_id: Joi.string().guid({ version: 'uuidv4' })
  })
}, {
  abortEarly: false
})

const customSusValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { sus_numero } = req.body
  if (!cnsValidator(sus_numero)) {
    throw new Error('"sus_numero" invalid')
  }
  next()
}

router
  .get('/alunos',
    pageValidator,
    AlunoController.findAll
  )
  .get('/alunos/:id',
    paramsValidator,
    AlunoController.findById
  )
  .post('/alunos',
    headerValidator,
    postValidatorAluno,
    customCpfValidator,
    customSusValidator,
    AlunoController.save
  )
  .put('/alunos/:id',
    headerValidator,
    paramsValidator,
    AlunoController.replace
  )
  .delete('/alunos/:id',
    paramsValidator,
    AlunoController.delete
  )

export default router
