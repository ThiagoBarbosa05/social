import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Username } from './value-objects/username'

export interface UserProps {
  name: string
  username: Username
  password: string
  email: string
  attachmentId?: string
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.name = value
  }

  get username() {
    return this.props.username.value
  }

  set username(value: string) {
    this.props.username = Username.create(value)
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set password(value: string) {
    this.props.password = value
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
    this.touch()
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  set attachmentId(value: string) {
    this.props.attachmentId = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        username: Username.create(props.username.value),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return user
  }
}
