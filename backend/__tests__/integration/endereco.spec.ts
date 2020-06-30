import request from 'supertest'
import app from '../../src/app'
import connection from '../../src/config/database'

export interface EnderecoInterface {
  rua: string,
  bairro: string,
  cep?: string,
  cidade: string,
  endereco: string
}

const createValidEndereco = (): EnderecoInterface => ({
  rua: 'Av Presidente Getúlio Vargas',
  bairro: 'Zona Rural',
  cep: '20.524-956',
  cidade: 'Nova Brena',
  endereco: 'Av Presidente Getúlio Vargas, Zona Rural, Nova Brena'
})

const createValidateTestError = (message: string, endereco: EnderecoInterface) => {
  return async (): Promise<void> => {
    const response = await request(app)
      .post('/api/enderecos')
      .send(endereco)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe(message)
  }
}

describe('ENDERECO Validate', () => {
  {
    const endereco = createValidEndereco()
    endereco.rua = 'Av'
    const message = '"rua" length must be at least 5 characters long'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.rua = ''
    const message = '"rua" is not allowed to be empty'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.bairro = 'Av'
    const message = '"bairro" length must be at least 3 characters long'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.bairro = ''
    const message = '"bairro" is not allowed to be empty'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.bairro = 'Centro da pituba'
    const message = '"bairro" length must be less than or equal to 10 characters long'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cidade = 'Av'
    const message = '"cidade" length must be at least 3 characters long'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cidade = ''
    const message = '"cidade" is not allowed to be empty'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cidade = 'Centro da pituba'
    const message = '"cidade" length must be less than or equal to 10 characters long'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.endereco = 'Av'
    const message = '"endereco" length must be at least 5 characters long'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cep = '45470-000'
    const message = `"cep" with value "${endereco.cep}" fails to match the required pattern: /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/`
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cep = '45470000'
    const message = `"cep" with value "${endereco.cep}" fails to match the required pattern: /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/`
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cep = '45.470000'
    const message = `"cep" with value "${endereco.cep}" fails to match the required pattern: /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/`
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cep = '45.5470-000'
    const message = `"cep" with value "${endereco.cep}" fails to match the required pattern: /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/`
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cep = '45470h00'
    const message = `"cep" with value "${endereco.cep}" fails to match the required pattern: /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/`
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cep = ''
    const message = '"cep" is not allowed to be empty'
    it(message, createValidateTestError(message, endereco))
  }

  {
    const endereco = createValidEndereco()
    endereco.cep = 'kk.ecv-oiu'
    const message = `"cep" with value "${endereco.cep}" fails to match the required pattern: /^[0-9]{2}.[0-9]{3}-[0-9]{3}$/`
    it(message, createValidateTestError(message, endereco))
  }
})

describe('ENDERECO', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to get ENDERECOS empthy', async () => {
    const response = await request(app)
      .get('/api/enderecos')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '0')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body).toEqual([])
  })

  it('should be able to create a new ENDERECO', async () => {
    const endereco = createValidEndereco()

    const response = await request(app)
      .post('/api/enderecos')
      .send(endereco)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('endereco')
    expect(response.body.endereco).toBe(`${endereco.rua}, ${endereco.bairro}, ${endereco.cidade}`)
    expect(response.body).toMatchObject({
      ...endereco,
      id: expect.any(String)
    })
  })

  it('should be able to failed on create a new ENDERECO with duplicate key endereco', async () => {
    const endereco = createValidEndereco()

    const response = await request(app)
      .post('/api/enderecos')
      .send(endereco)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message', expect.stringMatching(/duplicate key/))
    expect(response.body).not.toHaveProperty('endereco')
    expect(response.body).not.toHaveProperty('id')
  })

  it('should be able to failed on create a new ENDERECO with invalid argument', async () => {
    const endereco1 = createValidEndereco()
    endereco1.rua = 'dfasdfasdf'
    const endereco2 = createValidEndereco()
    endereco2.rua = 'dsfasdfasdff'

    const response = await request(app)
      .post('/api/enderecos')
      .send([endereco1, endereco2])

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).not.toHaveProperty('name')
    expect(response.body).toHaveProperty('message')
    expect(response.body).not.toHaveProperty('endereco')
    expect(response.body).not.toHaveProperty('id')
  })

  it('should be able to get ENDERECOS', async () => {
    const response = await request(app)
      .get('/api/enderecos')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '1')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
  })

  it('should be able to get ENDERECOS by id', async () => {
    const enderecos = await request(app)
      .get('/api/enderecos')

    const id = enderecos.body[0].id

    const response = await request(app)
      .get('/api/enderecos/' + id)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body).toMatchObject({
      ...response.body,
      id: expect.any(String)
    })
  })

  it('should be able to get ENDERECOS by id invalid', async () => {
    const response = await request(app)
      .get('/api/enderecos/' + 'sdfadfasfasdfasd')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })

  it('should be able to replace a ENDERECO', async () => {
    const enderecoMock = createValidEndereco()
    enderecoMock.rua = 'Travessa nunes'

    const enderecoCreated = await request(app)
      .post('/api/enderecos')
      .send(enderecoMock)

    const endereco = { ...enderecoCreated.body }
    endereco.rua = 'Travessa nunesa' // Alterando a rua

    const response = await request(app)
      .put('/api/enderecos/' + endereco.id)
      .send(endereco)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('endereco')
    expect(response.body.endereco).toBe(`${endereco.rua}, ${endereco.bairro}, ${endereco.cidade}`)
    expect(response.body).toMatchObject({
      ...response.body,
      id: expect.any(String)
    })
  })

  it('should be able to delete a ENDERECO', async () => {
    const enderecos = await request(app)
      .get('/api/enderecos')

    const id = enderecos.body[0].id

    const response = await request(app)
      .delete('/api/enderecos/' + id)

    expect(response.header).not.toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(204)
    expect(response.body).toBeTruthy()
  })

  it('should be able to delete a ENDERECO and generate error', async () => {
    const response = await request(app)
      .delete('/api/enderecos/' + 'hjfasdhfjahjfdfhlka')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })
})
