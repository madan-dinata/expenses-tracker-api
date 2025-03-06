import { z } from 'zod'

export const userSchema = z
  .object({
    fullName: z.string().nonempty(),
    email: z.string().email().nonempty(),
    password: z.string().min(6),
    confirmPassword: z.string()
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
