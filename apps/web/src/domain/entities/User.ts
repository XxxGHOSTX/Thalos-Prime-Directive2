// Domain Entity: User
// Represents a user in the system following DDD principles

export interface UserId {
  value: string
}

export interface UserProps {
  id: UserId
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: Omit<UserProps, 'createdAt' | 'updatedAt'>): User {
    return new User({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static fromPersistence(props: UserProps): User {
    return new User(props)
  }

  get id(): UserId {
    return this.props.id
  }

  get email(): string {
    return this.props.email
  }

  get name(): string {
    return this.props.name
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  updateName(name: string): void {
    this.props.name = name
    this.props.updatedAt = new Date()
  }

  toPersistence(): UserProps {
    return { ...this.props }
  }
}
