// Domain Entity: Task
// Represents a task in the system following DDD principles

export interface TaskId {
  value: string
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface TaskProps {
  id: TaskId
  title: string
  description: string
  status: TaskStatus
  assigneeId?: string
  createdAt: Date
  updatedAt: Date
}

export class Task {
  private constructor(private props: TaskProps) {}

  static create(
    props: Omit<TaskProps, 'createdAt' | 'updatedAt' | 'status'>
  ): Task {
    return new Task({
      ...props,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static fromPersistence(props: TaskProps): Task {
    return new Task(props)
  }

  get id(): TaskId {
    return this.props.id
  }

  get title(): string {
    return this.props.title
  }

  get description(): string {
    return this.props.description
  }

  get status(): TaskStatus {
    return this.props.status
  }

  get assigneeId(): string | undefined {
    return this.props.assigneeId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  updateStatus(status: TaskStatus): void {
    this.props.status = status
    this.props.updatedAt = new Date()
  }

  assignTo(userId: string): void {
    this.props.assigneeId = userId
    this.props.updatedAt = new Date()
  }

  toPersistence(): TaskProps {
    return { ...this.props }
  }
}
