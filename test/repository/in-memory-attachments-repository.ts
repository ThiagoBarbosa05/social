import { AttachmentsRepository } from '@/core/repositories/attachments-repository'
import { Attachment } from '@/domain/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
