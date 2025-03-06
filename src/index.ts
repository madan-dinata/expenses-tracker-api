import express, { Application, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { logger } from '@utils/logger'
import { requestLogger } from '@middlewares/requestLogger'
import { errorHandler } from '@middlewares/errorHandler'
import router from '@routes/index'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 3000
const api = '/api/v1'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())
app.use(requestLogger)

app.use(api, router)

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Expenses Tracker API' })
})

// Handle routes that are not found (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not Found')
  next({
    status: 404,
    code: 'NOT_FOUND',
    message: error.message
  })
})

// Error handler
app.use(errorHandler)

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`)
})
