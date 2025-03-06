import { Request, Response, NextFunction } from 'express'

import { userSchema } from '@utils/userValidation'
import { getAllUsers, signupUser } from '@services/userService'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = userSchema.parse(req.body)
    const user = await signupUser(validatedData.fullName, validatedData.email, validatedData.password)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user

    res.status(201).send({ data: userWithoutPassword })
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers()

    res.status(200).send({ data: users })
  } catch (error) {
    next(error)
  }
}
