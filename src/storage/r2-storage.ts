import { Uploader, UploaderParams } from '@/domain/storage/uploader'
import { Injectable } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { EnvService } from '@/env/env.service'
import { randomUUID } from 'node:crypto'

@Injectable()
export class R2Storage implements Uploader {
  private _client: S3Client

  constructor(private envService: EnvService) {
    this._client = new S3Client({
      endpoint: this.envService.get('CLOUDFARE_URL'),
      region: 'auto',
      credentials: {
        accessKeyId: this.envService.get('CLOUDFARE_ACCESS_KEY_ID'),
        secretAccessKey: this.envService.get('CLOUDFARE_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    body,
    fileName,
    fileType,
  }: UploaderParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this._client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('CLOUDFARE_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return { url: uniqueFileName }
  }
}

// const clientS3 = new S3Client({
//   endpoint: this.envService.get('CLOUDFARE_URL'),
//   region: 'auto',
//   credentials: {
//     accessKeyId: this.envService.get('CLOUDFARE_ACCESS_KEY_ID'),
//     secretAccessKey: this.envService.get('CLOUDFARE_SECRET_ACCESS_KEY'),
//   },
//   forcePathStyle: true,
// })

// const res = await clientS3.send(
//   new GetObjectCommand({
//     Bucket: 'fast-feet',
//     Key: '09eee440-00e8-48f8-aea9-942f0fee515c-nlw.png',
//   }),
// )
