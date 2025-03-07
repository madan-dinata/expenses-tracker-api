import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { AppError } from '@utils/appError'
import { errorLogger, warnLogger } from '@utils/logger'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ZodError) {
    const details: Record<string, string> = {}

    err.issues.forEach((issue) => {
      const field = issue.path.join('.')
      let code = issue.code.toUpperCase()

      if (issue.code === 'custom' && field === 'confirmPassword' && issue.message === 'Passwords do not match') {
        code = 'NOT_MATCH'
      }

      details[field] = code
    })

    const errors = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid Input',
      details
    }

    warnLogger.warn({ req: { method: req.method, url: req.originalUrl }, errors })
    res.status(400).json({ errors })
    return
  }

  if (err instanceof TokenExpiredError) {
    const errors = {
      code: 'UNAUTHORIZED',
      message: 'Unauthorized: Access Token expired'
    }

    warnLogger.warn({ req: { method: req.method, url: req.originalUrl }, errors })
    res.status(401).json({ errors })
    return
  }

  if (err instanceof JsonWebTokenError) {
    const errors = {
      code: 'UNAUTHORIZED',
      message: 'Unauthorized: Invalid token signature'
    }

    warnLogger.warn({ req: { method: req.method, url: req.originalUrl }, errors })
    res.status(401).json({ errors })
    return
  }

  if (err instanceof AppError) {
    const errors = {
      code: err.name,
      message: err.message
    }

    warnLogger.warn({ req: { method: req.method, url: req.originalUrl }, errors })
    res.status(err.status).json({ errors })
    return
  }

  const statusCode = err.status || 500

  const errors = {
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong.',
    details: err.details
  }

  if (err.details) {
    errors.details = err.details
  }

  if (statusCode >= 500) {
    errorLogger.error({ req: { method: req.method, url: req.originalUrl }, errors })
  } else {
    warnLogger.warn({ req: { method: req.method, url: req.originalUrl }, errors })
  }

  res.status(statusCode).send({ errors })
  return
}
