import { Response } from 'express'

export const clearRefreshToken = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  })
}
