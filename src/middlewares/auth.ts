import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { AppError } from '@utils/appError'

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next(new AppError('Unauthorized: No token provided', 401, 'UNAUTHORIZED'))
  }

  try {
    const decoded = verify(token, process.env.SECRET_KEY!) as { user: { id: string; email: string }; exp: number }

    res.locals.userId = decoded.user.id
    res.locals.tokenExp = decoded.exp

    next()
  } catch (err) {
    next(err)
  }
}
