import request from 'supertest'
import app from '../../src/app'
import connection from '../../src/config/database'

export interface QuizInterface {
  onibusEscolar: string,
  necessidadeEspecial: string,
  tratamentoEspecial: string,
  algumaAlergia: string,
  algumMedicamentoContinuado: string,
  procedimentoEscolar: string
}

const createValidQuiz = (): QuizInterface => ({
  onibusEscolar: 'NAO',
  necessidadeEspecial: 'Perda de Visão e Cegueira',
  tratamentoEspecial: 'Desintoxicação',
  algumaAlergia: 'Alimentos',
  algumMedicamentoContinuado: 'Hipoglós',
  procedimentoEscolar: 'LEVAR-AO-HOSPITAL'
})

const createValidateTestError = (message: string, quiz: QuizInterface) => {
  return async (): Promise<void> => {
    const response = await request(app)
      .post('/api/quizes')
      .send(quiz)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe(message)
  }
}

describe('QUIZ Validate', () => {
  {
    const quiz = createValidQuiz()
    quiz.onibusEscolar = 'Não'
    const message = '"onibusEscolar" with value "Não" fails to match the required pattern: /^(SIM|NAO)$/'
    it(message, createValidateTestError(message, quiz))
  }

  {
    const quiz = createValidQuiz()
    quiz.onibusEscolar = 'NAOs'
    const message = '"onibusEscolar" with value "NAOs" fails to match the required pattern: /^(SIM|NAO)$/'
    it(message, createValidateTestError(message, quiz))
  }

  {
    const quiz = createValidQuiz()
    quiz.procedimentoEscolar = 'CHAMAR-RESPONSAVELs'
    const message = '"procedimentoEscolar" with value "CHAMAR-RESPONSAVELs" fails to match the required pattern: /^(CHAMAR-RESPONSAVEL|LEVAR-AO-HOSPITAL)$/'
    it(message, createValidateTestError(message, quiz))
  }

  {
    const quiz = createValidQuiz()
    quiz.procedimentoEscolar = 'CHAMARRESPONSAVEL'
    const message = '"procedimentoEscolar" with value "CHAMARRESPONSAVEL" fails to match the required pattern: /^(CHAMAR-RESPONSAVEL|LEVAR-AO-HOSPITAL)$/'
    it(message, createValidateTestError(message, quiz))
  }
})

describe('QUIZ', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to get QUIZES empthy', async () => {
    const response = await request(app)
      .get('/api/quizes')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '0')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body).toEqual([])
  })

  it('should be able to create a new QUIZ', async () => {
    const quiz = createValidQuiz()

    const response = await request(app)
      .post('/api/quizes')
      .send(quiz)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to failed on create a new QUIZ with invalid argument', async () => {
    const quiz1 = createValidQuiz()
    quiz1.onibusEscolar = 'SIM'
    const quiz2 = createValidQuiz()
    quiz2.onibusEscolar = 'NAO'

    const response = await request(app)
      .post('/api/quizes')
      .send([quiz1, quiz2])

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).not.toHaveProperty('name')
    expect(response.body).toHaveProperty('message')
    expect(response.body).not.toHaveProperty('id')
  })

  it('should be able to get QUIZ', async () => {
    const response = await request(app)
      .get('/api/quizes')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '1')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
  })

  it('should be able to get QUIZES by id', async () => {
    const quizes = await request(app)
      .get('/api/quizes')

    const id = quizes.body[0].id

    const response = await request(app)
      .get('/api/quizes/' + id)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
  })

  it('should be able to get QUIZES by id invalid', async () => {
    const response = await request(app)
      .get('/api/quizes/' + 'sdfadfasfasdfasd')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })

  it('should be able to replace a QUIZ', async () => {
    const quizMock = createValidQuiz()
    quizMock.onibusEscolar = 'SIM'

    const quizCreated = await request(app)
      .post('/api/quizes')
      .send(quizMock)

    const quiz = { ...quizCreated.body }
    quiz.onibusEscolar = 'NAO' // Alterando a rua

    const response = await request(app)
      .put('/api/quizes/' + quiz.id)
      .send(quiz)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to delete a QUIZ', async () => {
    const quizes = await request(app)
      .get('/api/quizes')

    const id = quizes.body[0].id

    const response = await request(app)
      .delete('/api/quizes/' + id)

    expect(response.header).not.toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(204)
    expect(response.body).toBeTruthy()
  })

  it('should be able to delete a QUIZ and generate error', async () => {
    const response = await request(app)
      .delete('/api/quizes/' + 'hjfasdhfjahjfdfhlka')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })
})
