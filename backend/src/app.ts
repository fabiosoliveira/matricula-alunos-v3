import express, { Request, Response, NextFunction } from 'express'
import { errors } from 'celebrate'
import cors from 'cors'
import morgan from 'morgan'

import './config/dotenv'
import './config/database'
import routes from './routes'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use('/api/files', express.static('tmp/uploads'))
app.use('/api', routes)

// cach all
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // if (isCelebrate(err)) {
  //   return res.status(500).json({ message: err.message })
  // }

  return res.status(err.status || 500).json({ message: err.message })
})

app.use(errors())

export default app
