import { Uploader, UploaderParams } from '@/domain/storage/uploader'
import { randomUUID } from 'node:crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload(params: UploaderParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName: params.fileName,
      url,
    })

    return { url }
  }
}
