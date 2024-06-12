import { Either, left, right } from '@/core/either'
import { Attachment } from '@/domain/entities/attachment'
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error'
import { Injectable } from '@nestjs/common'
import { Uploader } from '@/domain/storage/uploader'
import { AttachmentsRepository } from '@/core/repositories/attachments-repository'

type UploadAttachmentUseCaseInput = {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAttachmentUseCaseOutput = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private uploader: Uploader,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAttachmentUseCaseInput): Promise<UploadAttachmentUseCaseOutput> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const fileNameNormalized = fileName
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    const { url } = await this.uploader.upload({
      body,
      fileName: fileNameNormalized,
      fileType,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
