/**
 * User API Contracts
 */

import { z } from 'zod'

// Request schemas
export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})

export const UpdateUserRequestSchema = z.object({
  name: z.string().min(1).optional(),
})

// Response schemas
export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Type exports
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
