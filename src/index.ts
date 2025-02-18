import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { logger } from '@utils/logger'
import { requestLogger } from '@middlewares/requestLogger'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(requestLogger)

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Expenses Tracker API' })
})

// Handle routes that are not found (404)
app.use((req: Request, res: Response) => {
  res.status(404).send({
    errors: {
      code: 'NOT_FOUND',
      message: 'Not Found'
    }
  })
})

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`)
})
