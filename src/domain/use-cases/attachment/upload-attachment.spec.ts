import { InMemoryAttachmentsRepository } from 'test/repository/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { UploadAttachmentUseCase } from './upload-attachment'
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let uploader: FakeUploader
let sut: UploadAttachmentUseCase

describe('Upload Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    uploader = new FakeUploader()

    sut = new UploadAttachmentUseCase(uploader, inMemoryAttachmentsRepository)
  })

  it('should be able to upload an attachment', async () => {
    const result = await sut.execute({
      body: Buffer.from('image'),
      fileName: 'image.png',
      fileType: 'image/png',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      attachment: {
        title: 'image.png',
        url: expect.any(String),
      },
    })
    expect(uploader.uploads).toHaveLength(1)
  })

  it('should not be able to upload an attachment with invalid file type.', async () => {
    const result = await sut.execute({
      body: Buffer.from('image'),
      fileName: 'example.mp3',
      fileType: 'audio/mpeg',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
