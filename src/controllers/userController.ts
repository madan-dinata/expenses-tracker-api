import { Request, Response, NextFunction } from 'express'
import { sign, verify } from 'jsonwebtoken'

import { userSignInSchema, userSignUpSchema } from '@utils/userValidation'
import { deleteUser, getAllUsers, getUser, getUserWithPassword, signinUser, signupUser } from '@services/userService'
import { sendRefreshToken } from '@utils/sendRefreshToken'
import { AppError } from '@utils/appError'
import { clearRefreshToken } from '@utils/clearRefreshToken'

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers()

    res.status(200).send({ data: users })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.userId

    if (!userId) {
      return next(new AppError('Unauthorized: No token provided', 401, 'UNAUTHORIZED'))
    }

    const user = await getUser(userId)

    res.status(200).send({ data: user })
  } catch (error) {
    next(error)
  }
}

export const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body

    const userId = res.locals.userId

    if (!userId) {
      return next(new AppError('Unauthorized: No token provided', 401, 'UNAUTHORIZED'))
    }

    const user = await getUserWithPassword(userId)

    if (!user) {
      return next(new AppError('User not found', 400, 'NOT_FOUND'))
    }

    await deleteUser(userId, password, user.password)

    clearRefreshToken(res)

    res.status(200).send({ message: 'Successfully delete account' })
  } catch (error) {
    next(error)
  }
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = userSignUpSchema.parse(req.body)
    const user = await signupUser(validatedData.fullName, validatedData.email, validatedData.password)

    res.status(201).send({ data: user })
  } catch (error) {
    next(error)
  }
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validateData = userSignInSchema.parse(req.body)

    const user = await signinUser(validateData.email, validateData.password)

    sendRefreshToken(res, user.refreshToken)

    res.status(200).send({ data: user })
  } catch (error) {
    next(error)
  }
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return next(new AppError('Unauthorized: No refresh token provided', 401, 'UNAUTHORIZED'))
    }

    const decoded = verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as { userId: string }

    const newAccessToken = sign({ userId: decoded.userId }, process.env.SECRET_KEY!, { expiresIn: '1h' })

    res.status(200).send({ accessToken: newAccessToken })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    clearRefreshToken(res)

    res.status(200).send({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}
