import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface AttachmentProps {
  title: string
  url: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
    this.touch()
  }

  get url() {
    return this.props.url
  }

  set url(value: string) {
    this.props.url = value
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

  static create(
    props: Optional<AttachmentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const attachment = new Attachment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return attachment
  }
}
