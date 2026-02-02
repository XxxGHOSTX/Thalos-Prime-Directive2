/**
 * Task Domain Types
 */

import { z } from 'zod'

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const TaskIdSchema = z.object({
  value: z.string().uuid(),
})

export const TaskSchema = z.object({
  id: TaskIdSchema,
  title: z.string().min(1),
  description: z.string(),
  status: z.nativeEnum(TaskStatus),
  assigneeId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type TaskId = z.infer<typeof TaskIdSchema>
export type Task = z.infer<typeof TaskSchema>
