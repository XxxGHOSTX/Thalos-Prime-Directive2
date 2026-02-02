/**
 * Task API Contracts
 */

import { z } from 'zod'

// Request schemas
export const CreateTaskRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  assigneeId: z.string().uuid().optional(),
})

export const UpdateTaskRequestSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  assigneeId: z.string().uuid().optional(),
})

// Response schemas
export const TaskResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  assigneeId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Type exports
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>
export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>
export type TaskResponse = z.infer<typeof TaskResponseSchema>
