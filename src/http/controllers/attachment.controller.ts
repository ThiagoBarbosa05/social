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
import { IsPublic } from '../auth/public'
import { UploadAttachmentUseCase } from '@/domain/use-cases/attachment/upload-attachment'

@Controller('/attachment')
export class AttachmentController {
  constructor(private uploadAttachment: UploadAttachmentUseCase) {}
  @Get()
  @IsPublic()
  async find() {
    return 'attachment'
  }

  @UseInterceptors(FileInterceptor('file'))
  @IsPublic()
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
    const result = await this.uploadAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    return result
  }
}
