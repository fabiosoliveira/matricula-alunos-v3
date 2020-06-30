/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import request from 'supertest'
import app from '../../src/app'
import connection from '../../src/config/database'

interface ResponsavelInterface {
  nome: string,
  parentesco: string,
  cpf_numero: string,
  rg_numero_registro: string,
  rg_data_espedicao: Date,
  rg_emissor: string,
  rg_nome_pai: string,
  rg_nome_mae: string,
}

const createValidResponsavel = (): ResponsavelInterface => ({
  nome: 'Carlo Alberto de Nobrega',
  parentesco: 'pai',
  cpf_numero: '735.274.681-10',
  rg_numero_registro: '352.652.523-55',
  rg_data_espedicao: new Date(),
  rg_emissor: 'SSP/BA',
  rg_nome_pai: 'Marcos Antônio',
  rg_nome_mae: 'Maria Carla'
})

const createValidateTestError = (message: string, responsavel: ResponsavelInterface) => {
  return async (): Promise<void> => {
    const response = await request(app)
      .post('/api/responsaveis')
      .send(responsavel)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe(message)
  }
}

describe('RESPONSAVEL Validate', () => {
  {
    const responsavel = createValidResponsavel()
    responsavel.nome = 'a'
    const message = '"nome" length must be at least 3 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.nome = 'carlos sei lasfas asfdadf asdf asddfaf asdf carlos sei lasfas asfdadf asdf asddfaf asdf asdf asdf'
    const message = '"nome" length must be less than or equal to 80 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.parentesco = 'a'
    const message = '"parentesco" length must be at least 3 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.parentesco = 'carlos sei lasfas asfdadf asdf asddfaf asdf carlos sei lasfas asfdadf asdf asddfaf asdf asdf asdf'
    const message = '"parentesco" length must be less than or equal to 10 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.cpf_numero = '24.272.444-57'
    const message = '"cpf_numero" length must be 14 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.cpf_numero = '243.272.444-574'
    const message = '"cpf_numero" length must be 14 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.cpf_numero = '243.272.444-54'
    const message = '"cpf_numero" invalid'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.cpf_numero = '243.272.444554'
    const message = '"cpf_numero" invalid'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.rg_numero_registro = '243.272.444-574'
    const message = '"rg_numero_registro" length must be less than or equal to 14 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.rg_data_espedicao = new Date('1986/15/26')
    const message = '"rg_data_espedicao" must be a valid date'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.rg_emissor = 'SSP/BA dfasdfsdf'
    const message = '"rg_emissor" length must be less than or equal to 7 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.rg_nome_pai = 'a'
    const message = '"rg_nome_pai" length must be at least 3 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.rg_nome_pai = 'carlos sei lasfas asfdadf asdf asddfaf asdf carlos sei lasfas asfdadf asdf asddfaf asdf asdf asdf'
    const message = '"rg_nome_pai" length must be less than or equal to 80 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.rg_nome_mae = 'a'
    const message = '"rg_nome_mae" length must be at least 3 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.rg_nome_mae = 'carlos sei lasfas asfdadf asdf asddfaf asdf carlos sei lasfas asfdadf asdf asddfaf asdf asdf asdf'
    const message = '"rg_nome_mae" length must be less than or equal to 80 characters long'
    it(message, createValidateTestError(message, responsavel))
  }

  {
    const responsavel = createValidResponsavel()
    responsavel.rg_nome_mae = 'carlos sei lasfas asfdadf asdf asddfaf asdf carlos sei lasfas asfdadf asdf asddfaf asdf asdf asdf'
    const message = '"rg_nome_mae" length must be less than or equal to 80 characters long'
    it(message, createValidateTestError(message, responsavel))
  }
})

describe('RESPONSAVEL', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to get RESPONSÁVEIS empthy', async () => {
    const response = await request(app)
      .get('/api/responsaveis')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '0')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body).toEqual([])
  })

  it('should be able to create a new RESPONSAVEL', async () => {
    const responsavel = createValidResponsavel()

    const response = await request(app)
      .post('/api/responsaveis')
      .send(responsavel)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to failed on create a new RESPONSAVEL with duplicate key cpf_numero', async () => {
    const responsavel = createValidResponsavel()

    const response = await request(app)
      .post('/api/responsaveis')
      .send(responsavel)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message', expect.stringMatching(/duplicate key value violates unique constraint/))
    expect(response.body).not.toHaveProperty('cpf_numero')
    expect(response.body).not.toHaveProperty('id')
  })

  it('should be able to failed on create a new RESPONSÁVEL with invalid argument', async () => {
    const responsavel1 = createValidResponsavel()
    responsavel1.cpf_numero = '855.122.273-27'
    const responsavel2 = createValidResponsavel()
    responsavel2.cpf_numero = '726.134.422-20'

    const response = await request(app)
      .post('/api/responsaveis')
      .send([responsavel1, responsavel2])

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
    expect(response.body).not.toHaveProperty('id')
  })

  it('should be able to get RESPONSÁVEIS', async () => {
    const response = await request(app)
      .get('/api/responsaveis')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '1')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
  })

  it('should be able to get RESPONSÁVEL by id', async () => {
    const responsaveis = await request(app)
      .get('/api/responsaveis')

    const id = responsaveis.body[0].id

    const response = await request(app)
      .get('/api/responsaveis/' + id)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to get RESPONSÁVEIS by id invalid', async () => {
    const response = await request(app)
      .get('/api/responsaveis/' + 'sdfadfasfasdfasd')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })

  it('should be able to replace a RESPONSÁVEL', async () => {
    const responsavelMock = createValidResponsavel()
    responsavelMock.nome = 'Marcos Paulo'
    responsavelMock.cpf_numero = '418.354.476-94'

    const responsavelCreated = await request(app)
      .post('/api/responsaveis')
      .send(responsavelMock)

    const responsavel = { ...responsavelCreated.body }
    responsavel.nome = 'Pula Fosse' // Alterando a rua

    const response = await request(app)
      .put('/api/responsaveis/' + responsavel.id)
      .send(responsavel)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to delete a RESPONSÁVEL', async () => {
    const responsaveis = await request(app)
      .get('/api/responsaveis')

    const id = responsaveis.body[0].id

    const response = await request(app)
      .delete('/api/responsaveis/' + id)

    expect(response.header).not.toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(204)
    expect(response.body).toBeTruthy()
  })

  it('should be able to delete a RESPONSÁVEL and generate error', async () => {
    const response = await request(app)
      .delete('/api/responsaveis/' + 'hjfasdhfjahjfdfhlka')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })
})
