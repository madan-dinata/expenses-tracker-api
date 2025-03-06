import { Router } from 'express'

import { getUsers, signup } from '@controllers/userController'

const userRouter = Router()

userRouter.get('/users', getUsers)
userRouter.post('/signup', signup)

export default userRouter
