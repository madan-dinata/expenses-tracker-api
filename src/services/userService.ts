import bcrypt from 'bcrypt'

import { createUser, findAllUsers, findUserByEmail } from '@repositories/userRepository'
import { AppError } from '@utils/appError'

export const getAllUsers = async () => findAllUsers()

export const signupUser = async (fullName: string, email: string, password: string) => {
  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    throw new AppError('Email is already registered', 400, 'EMAIL_ALREADY_EXISTS')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  return createUser(fullName, email, hashedPassword)
}
