import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status-codes'

import fs from 'fs'
import sharp from 'sharp'
import aws from 'aws-sdk'

import knex from '../config/database'
import { v4 as uuidv4 } from 'uuid'

const s3 = new aws.S3()

interface ParamsInterface {
  left: number,
  top: number,
  width: number,
  height: number
}

const resizeFoto = async (params: ParamsInterface, file: object): Promise<any> => {
  const fileBuffer = await sharp(file)
    .extract(params)
    .resize(100)
    .toBuffer()

  if (!fileBuffer) {
    throw new Error('Foto convert error')
  }

  return fileBuffer
}

const sendToFileSystem = ({ key, buffer }: any): Promise<void> => {
  const newPath = `tmp/uploads/${key}`

  // eslint-disable-next-line promise/param-names
  return new Promise((resolv, reject) => {
    fs.writeFile(newPath, buffer, (err): void => {
      if (err) {
        reject(err)
      }
      resolv()
    })
  })
}

const sendToS3 = async (key: string, mimetype: string, buffer: any): Promise<any> => {
  const params: aws.S3.Types.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: key, // File name you want to save as in S3
    ContentType: mimetype,
    ACL: 'public-read',
    Body: buffer // fileContent
  }

  // eslint-disable-next-line promise/param-names
  return new Promise((resolv, reject) => {
    s3.upload(params, (err, data): void => {
      if (err) {
        reject(err)
      } else {
        resolv(data)
      }
    })
  })
}

export default {

  // get
  async findAll (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { page = '1', limit = '10' } = req.query

      const limitParam = parseInt(limit as string)
      const pageParam = parseInt(page as string)

      const skip = (pageParam - 1) * limitParam

      const fotos = await knex('fotos')
        .select()
        .whereNull('deleted_at')
        .limit(limitParam)
        .offset(skip)

      const [count] = await knex('fotos').whereNull('deleted_at').count()

      res.header('X-Total-Count', count.count)

      return res.json(fotos)
    } catch (error) {
      next(error)
    }
  },

  // post
  async save (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { left, top, width, height } = req.body

      const { originalname, mimetype, buffer } = req.file

      const bufferFile = await resizeFoto({
        left: parseInt(left),
        top: parseInt(top),
        width: parseInt(width),
        height: parseInt(height)
      }, buffer)

      let url = ''

      const id = uuidv4()
      const key = `foto-${id}.png`

      if (process.env.STORAGE_TYPE === 's3') {
        const data = await sendToS3(key, mimetype, bufferFile)

        url = data.Location
      } else {
        await sendToFileSystem({ key, buffer: bufferFile })

        url = `${process.env.APP_URL}/api/files/${key}`
      }

      await knex('fotos')
        .insert({
          id,
          name: originalname,
          size: bufferFile.byteLength,
          key,
          url
        })

      const [fotoCreated] = await knex('fotos')
        .select()
        .where({ id })

      return res.status(httpStatus.CREATED).json(fotoCreated)
    } catch (error) {
      next(error)
    }
  },

  // del
  async delete (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params

      const deleted = await knex('fotos')
        .whereNull('deleted_at')
        .where({ id })
        .update('deleted_at', new Date())
        // .del()

      if (!deleted) {
        throw new Error('Foto delete error')
      }

      return res.sendStatus(httpStatus.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}
