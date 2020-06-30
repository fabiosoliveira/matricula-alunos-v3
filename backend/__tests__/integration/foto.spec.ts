import request from 'supertest'
import app from '../../src/app'
import connection from '../../src/config/database'

describe('FOTO', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to get FOTO empthy', async () => {
    const response = await request(app)
      .get('/api/fotos')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '0')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
    expect(response.body).toEqual([])
  })

  it('should be able to create a new FOTO', async () => {
    const response = await request(app)
      .post('/api/fotos')
      .field('left', 337)
      .field('top', 0)
      .field('width', 1081)
      .field('height', 1080)
      .attach('file', `${__dirname}/Inuyasha.png`)

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to get FOTOS', async () => {
    const response = await request(app)
      .get('/api/fotos')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.header).toHaveProperty('x-total-count', '1')
    expect(response.status).toBe(200)
    expect(response.body).not.toBeUndefined()
  })

  it('should be able to delete a FOTO', async () => {
    const fotos = await request(app)
      .get('/api/fotos')

    const id = fotos.body[0].id

    const response = await request(app)
      .delete('/api/fotos/' + id)

    expect(response.header).not.toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(204)
    expect(response.body).toBeTruthy()
  })

  it('should be able to delete a FOTO and generate error', async () => {
    const response = await request(app)
      .delete('/api/fotos/' + 'hjfasdhfjahjfdfhlka')

    expect(response.header).toHaveProperty('content-type', expect.stringMatching(/json/))
    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('message')
  })
})
