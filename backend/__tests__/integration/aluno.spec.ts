/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import request from 'supertest'
import app from '../../src/app'
import connection from '../../src/config/database'

export interface AlunoInterface {
    nome: string,
    dataNascimento: Date,
    cor: string,
    genero: string,
    telefone: string,
    sus_numero: string,
    cpf_numero: string,
    status: string,
    rg_numero_registro: string,
    rg_data_espedicao: Date,
    rg_emissor: string,
    rg_nome_pai: string,
    rg_nome_mae: string
}

const createValidAluno = (): AlunoInterface => ({
  nome: 'César Albuquerque',
  dataNascimento: new Date('2020-5-12'),
  cor: 'NEGRO',
  genero: 'FEMININO',
  telefone: '(75) 95999-5772',
  sus_numero: '118658985690004',
  cpf_numero: '874.385.143-66',
  status: 'ATIVO',
  rg_numero_registro: '739.103.474-77',
  rg_data_espedicao: new Date('2020-5-12'),
  rg_emissor: 'SSP/MG',
  rg_nome_pai: 'Roberto Moraes',
  rg_nome_mae: 'Srta. Yago Costa'
})

const createValidateTestError = (message: string, aluno: AlunoInterface) => {
  return async (): Promise<void> => {
    const response = await request(app)
      .post('/api/alunos')
      .send(aluno)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe(message)
  }
}

describe('ALUNO Validate', () => {
  {
    const aluno = createValidAluno()
    aluno.nome = ''
    const message = '"nome" is not allowed to be empty'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.nome = 'ad'
    const message = '"nome" length must be at least 3 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.nome = 'askdjklksd akjsldfjlajsldkfjalkjsjfd s dkfjajsdfljfalkdsjflj asdjflkfjajsdjflja sd asd kfjfakjsdlkfjlajsdlfjaj sdfd'
    const message = '"nome" length must be less than or equal to 80 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.rg_nome_pai = 'ad'
    const message = '"rg_nome_pai" length must be at least 3 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.rg_nome_pai = 'askdjklksd akjsldfjlajsldkfjalkjsjfd s dkfjajsdfljfalkdsjflj asdjflkfjajsdjflja sd asd kfjfakjsdlkfjlajsdlfjaj sdfd'
    const message = '"rg_nome_pai" length must be less than or equal to 80 characters long'
    it(message, createValidateTestError(message, aluno))
  }
  {
    const aluno = createValidAluno()
    aluno.rg_nome_mae = 'ad'
    const message = '"rg_nome_mae" length must be at least 3 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.rg_nome_mae = 'askdjklksd akjsldfjlajsldkfjalkjsjfd s dkfjajsdfljfalkdsjflj asdjflkfjajsdjflja sd asd kfjfakjsdlkfjlajsdlfjaj sdfd'
    const message = '"rg_nome_mae" length must be less than or equal to 80 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.dataNascimento = new Date('1986/15/26')
    const message = '"dataNascimento" must be a valid date'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.rg_data_espedicao = new Date('1986/15/26')
    const message = '"rg_data_espedicao" must be a valid date'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.cor = ''
    const message = '"cor" is not allowed to be empty'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.cor = 'Negro'
    const message = '"cor" with value "Negro" fails to match the required pattern: /^(BRANCO|PARDO|NEGRO)$/'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.cor = 'NEGROs'
    const message = '"cor" with value "NEGROs" fails to match the required pattern: /^(BRANCO|PARDO|NEGRO)$/'
    it(message, createValidateTestError(message, aluno))
  }
  {
    const aluno = createValidAluno()
    aluno.genero = ''
    const message = '"genero" is not allowed to be empty'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.genero = 'Masculino'
    const message = '"genero" with value "Masculino" fails to match the required pattern: /^(MASCULINO|FEMININO)$/'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.genero = 'MASCULINOo'
    const message = '"genero" with value "MASCULINOo" fails to match the required pattern: /^(MASCULINO|FEMININO)$/'
    it(message, createValidateTestError(message, aluno))
  }
  {
    const aluno = createValidAluno()
    aluno.status = ''
    const message = '"status" is not allowed to be empty'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.status = 'Negro'
    const message = '"status" with value "Negro" fails to match the required pattern: /^(ATIVO|INATIVO|MATRICULADO)$/'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.status = 'NEGROs'
    const message = '"status" with value "NEGROs" fails to match the required pattern: /^(ATIVO|INATIVO|MATRICULADO)$/'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.telefone = '75988223930'
    const message = '"telefone" length must be 15 characters long. "telefone" with value "75988223930" fails to match the required pattern: /^\\([1-9]{2}\\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.telefone = '(75) 95999-577k'
    const message = '"telefone" with value "(75) 95999-577k" fails to match the required pattern: /^\\([1-9]{2}\\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.telefone = '(75) 95999 5770'
    const message = '"telefone" with value "(75) 95999 5770" fails to match the required pattern: /^\\([1-9]{2}\\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.sus_numero = '5465464654546456464'
    const message = '"sus_numero" length must be 15 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.sus_numero = '5465464456464'
    const message = '"sus_numero" length must be 15 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.sus_numero = '548965325412563'
    const message = '"sus_numero" invalid'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.sus_numero = ''
    const message = '"sus_numero" is not allowed to be empty'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.cpf_numero = '24.272.444-57'
    const message = '"cpf_numero" length must be 14 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.cpf_numero = '243.272.444-574'
    const message = '"cpf_numero" length must be 14 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.cpf_numero = '243.272.444-54'
    const message = '"cpf_numero" invalid'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.cpf_numero = '243.272.444554'
    const message = '"cpf_numero" invalid'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.cpf_numero = ''
    const message = '"cpf_numero" is not allowed to be empty'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.rg_numero_registro = '243.272.444-574'
    const message = '"rg_numero_registro" length must be 14 characters long'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.rg_data_espedicao = new Date('1986/15/26')
    const message = '"rg_data_espedicao" must be a valid date'
    it(message, createValidateTestError(message, aluno))
  }

  {
    const aluno = createValidAluno()
    aluno.rg_emissor = 'SSP/BA dfasdfsdf'
    const message = '"rg_emissor" length must be less than or equal to 7 characters long'
    it(message, createValidateTestError(message, aluno))
  }
})

describe('ALUNO', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to get ALUNOS empthy', async () => {
    const response = await request(app)
      .get('/api/alunos')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '0')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body).toEqual([])
  })

  it('should be able to create a new ALUNO', async () => {
    const aluno = createValidAluno()

    const response = await request(app)
      .post('/api/alunos')
      .send(aluno)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to failed on create a new ALUNO with duplicate key sus and cpf', async () => {
    const aluno = createValidAluno()

    const response = await request(app)
      .post('/api/alunos')
      .send(aluno)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message', expect.stringMatching(/duplicate key/))
    expect(response.body).not.toHaveProperty('aluno')
    expect(response.body).not.toHaveProperty('id')
  })

  it('should be able to failed on create a new ALUNO with invalid argument', async () => {
    const aluno1 = createValidAluno()
    aluno1.nome = 'dfasdfasdf'
    const aluno2 = createValidAluno()
    aluno2.nome = 'dsfasdfasdff'

    const response = await request(app)
      .post('/api/alunos')
      .send([aluno1, aluno2])

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).not.toHaveProperty('nome')
    expect(response.body).toHaveProperty('message')
    expect(response.body).not.toHaveProperty('id')
  })

  it('should be able to get ALUNOS', async () => {
    const response = await request(app)
      .get('/api/alunos')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '1')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
  })

  it('should be able to get ALUNOS by id', async () => {
    const alunos = await request(app)
      .get('/api/alunos')

    const id = alunos.body[0].id

    const response = await request(app)
      .get('/api/alunos/' + id)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
  })

  it('should be able to get ALUNOS by id invalid', async () => {
    const response = await request(app)
      .get('/api/alunos/' + 'sdfadfasfasdfasd')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })

  it('should be able to replace a ALUNO', async () => {
    const alunoMock = createValidAluno()
    alunoMock.sus_numero = '981677692260018'
    alunoMock.cpf_numero = '516.211.725-03'
    alunoMock.nome = 'Fábio Souza'

    const alunoCreated = await request(app)
      .post('/api/alunos')
      .send(alunoMock)

    const aluno = { ...alunoCreated.body }
    aluno.nome = 'Fábio Souza Oliveira' // Alterando a rua

    const response = await request(app)
      .put('/api/alunos/' + aluno.id)
      .send(aluno)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to delete a ALUNO', async () => {
    const alunos = await request(app)
      .get('/api/alunos')

    const id = alunos.body[0].id

    const response = await request(app)
      .delete('/api/alunos/' + id)

    expect(response.header).not.toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(204)
    expect(response.body).toBeTruthy()
  })

  it('should be able to delete a ALUNO and generate error', async () => {
    const response = await request(app)
      .delete('/api/alunos/' + 'hjfasdhfjahjfdfhlka')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })
})
