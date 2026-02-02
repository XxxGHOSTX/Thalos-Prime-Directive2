// Application Use Case: Create Task
// Orchestrates domain logic for creating a new task

import { Task, TaskId } from '@/domain/entities/Task'
import { TaskRepository } from '@/domain/repositories/TaskRepository'

export interface CreateTaskDTO {
  title: string
  description: string
  assigneeId?: string
}

export interface CreateTaskUseCase {
  execute(dto: CreateTaskDTO): Promise<Task>
}

export class CreateTask implements CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    const taskId: TaskId = { value: crypto.randomUUID() }
    
    const task = Task.create({
      id: taskId,
      title: dto.title,
      description: dto.description,
      assigneeId: dto.assigneeId,
    })

    await this.taskRepository.save(task)
    
    return task
  }
}
