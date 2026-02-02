// Domain Repository Interface: Task Repository
// Defines the contract for task data access

import { Task, TaskId, TaskStatus } from '../entities/Task'

export interface TaskRepository {
  findById(id: TaskId): Promise<Task | null>
  findByStatus(status: TaskStatus): Promise<Task[]>
  findByAssignee(assigneeId: string): Promise<Task[]>
  findAll(): Promise<Task[]>
  save(task: Task): Promise<void>
  delete(id: TaskId): Promise<void>
}
