import { Router } from 'express'

import { deleteMe, getMe, getUsers, logout, refreshAccessToken, signin, signup } from '@controllers/userController'
import { authenticateUser } from '@middlewares/auth'

const userRouter = Router()

userRouter.get('/me', authenticateUser, getMe)
userRouter.delete('/me', authenticateUser, deleteMe)
userRouter.get('/users', authenticateUser, getUsers)
userRouter.post('/signup', signup)
userRouter.post('/signin', signin)
userRouter.post('/refresh', authenticateUser, refreshAccessToken)
userRouter.delete('/logout', authenticateUser, logout)

export default userRouter
