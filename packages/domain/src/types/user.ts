/**
 * User Domain Types
 */

import { z } from 'zod'

export const UserIdSchema = z.object({
  value: z.string().uuid(),
})

export const UserSchema = z.object({
  id: UserIdSchema,
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserId = z.infer<typeof UserIdSchema>
export type User = z.infer<typeof UserSchema>
