import { EnvService } from '@/env/env.service'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachment')
export class AttachmentController {
  constructor(private envService: EnvService) {}
  @Get()
  async find() {
    const client = new S3Client({
      endpoint: this.envService.get('CLOUDFARE_URL'),
      region: 'auto',
      credentials: {
        accessKeyId: this.envService.get('CLOUDFARE_ACCESS_KEY_ID'),
        secretAccessKey: this.envService.get('CLOUDFARE_SECRET_ACCESS_KEY'),
      },
    })

    const res = await client.send(
      new GetObjectCommand({
        Bucket: 'fast-feet',
        Key: '79dc202b-6ac5-4523-9b24-ce2845b2d7e3-nlw.png',
      }),
    )

    return 'attachment'
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file)
  }
}
