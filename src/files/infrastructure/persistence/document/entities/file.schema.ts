// import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
// import { Transform, Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
// import { AppConfig } from '@src/config/app-config.type';
// import appConfig from '@src/config/app.config';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { FileConfig, FileDriver } from '@src/files/config/file-config.type';
import fileConfig from '@src/files/config/file.config';
import { ApiProperty } from '@nestjs/swagger';
// import { OssUtils } from '@src/files/infrastructure/uploader/oss/oss.utils';

export type FileSchemaDocument = HydratedDocument<FileSchemaClass>;

@Schema({
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FileSchemaClass extends EntityDocumentHelper {
  @ApiProperty({
    type: String,
    example: 'https://example.com/path/to/file.jpg',
  })
  @Prop()
  path: string;

  @ApiProperty({
    type: String,
    example: 'file.jpg',
  })
  @Prop({ type: String, default: null })
  name: string;

  @ApiProperty({
    type: String,
    enum: FileDriver,
  })
  @Prop({ type: String, enum: FileDriver })
  driver: string;

  @ApiProperty({
    type: String,
    example: 'image/jpeg',
  })
  @Prop()
  mime: string;

  @ApiProperty({
    type: Number,
    example: 1024,
  })
  @Prop({ type: Number, required: true })
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(FileSchemaClass);

FileSchema.pre('save', function (next) {
  this.driver = (fileConfig() as FileConfig).driver;
  next();
});
