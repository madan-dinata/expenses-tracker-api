import prisma from '@db/index'

export const findAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      password: false,
      created_at: true,
      updated_at: true
    }
  })
}

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } })
}

export const createUser = async (fullName: string, email: string, hashedPassword: string) => {
  return prisma.user.create({
    data: {
      fullName: fullName,
      email: email,
      password: hashedPassword
    }
  })
}
