import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import {
  createUser,
  findAllUsers,
  findUserByEmail,
  findUserByEmailWithoutPassword,
  findUserByID,
  findUserByIDWithoutPassword,
  removeUser
} from '@repositories/userRepository'
import { AppError } from '@utils/appError'

export const getAllUsers = async () => findAllUsers()

export const getUser = async (id: string) => findUserByIDWithoutPassword(id)

export const getUserWithPassword = async (id: string) => findUserByID(id)

export const deleteUser = async (id: string, password: string, userPassword: string) => {
  const isPasswordValid = await compare(password, userPassword)

  if (!isPasswordValid) {
    throw new AppError('Invalid password', 401, 'INVALID_CREDENTIALS')
  }

  return removeUser(id)
}

export const signupUser = async (fullName: string, email: string, password: string) => {
  const existingUser = await findUserByEmailWithoutPassword(email)

  if (existingUser) {
    throw new AppError('Email is already registered', 400, 'EMAIL_ALREADY_EXISTS')
  }

  const hashedPassword = await hash(password, 10)

  return createUser(fullName, email, hashedPassword)
}

export const signinUser = async (email: string, password: string) => {
  const existingUser = await findUserByEmail(email)

  if (!existingUser) {
    throw new AppError('Email not found', 400, 'NOT_FOUND')
  }

  const isPasswordValid = await compare(password, existingUser.password)

  if (!isPasswordValid) {
    throw new AppError('Invalid password', 401, 'INVALID_CREDENTIALS')
  }

  const accessTokenExpiresIn = 60 * 60

  const accessToken = sign(
    { user: { id: existingUser.id, fullName: existingUser.fullName, email: existingUser.email } },
    process.env.SECRET_KEY!,
    { expiresIn: accessTokenExpiresIn }
  )

  const refreshToken = sign({ userId: existingUser.id }, process.env.REFRESH_SECRET_KEY!, { expiresIn: '30d' })

  return { accessToken, refreshToken, expiresIn: accessTokenExpiresIn }
}
