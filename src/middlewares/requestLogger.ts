import { Request, Response, NextFunction } from 'express'
import { apiLogger, warnLogger, errorLogger } from '@utils/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime

    if (res.statusCode >= 500) {
      errorLogger.error(
        `method: ${req.method}, url: ${req.originalUrl}, status:  ${res.statusCode}, duration: ${duration}ms`
      )
    } else if (res.statusCode >= 400) {
      warnLogger.warn(
        `method: ${req.method}, url: ${req.originalUrl}, status:  ${res.statusCode}, duration: ${duration}ms`
      )
    } else {
      apiLogger.info(
        `method: ${req.method}, url: ${req.originalUrl}, status:  ${res.statusCode}, duration: ${duration}ms`
      )
    }
  })

  next()
}
