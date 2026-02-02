// Application Use Case: Get All Tasks
// Orchestrates domain logic for retrieving tasks

import { Task } from '@/domain/entities/Task'
import { TaskRepository } from '@/domain/repositories/TaskRepository'

export interface GetAllTasksUseCase {
  execute(): Promise<Task[]>
}

export class GetAllTasks implements GetAllTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return await this.taskRepository.findAll()
  }
}
