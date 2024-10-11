import { Injectable } from '@nestjs/common';

import { FileRepository } from '../../file.repository';
import { FileSchemaClass } from '../entities/file.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileType } from '@src/files/domain/file';

import { FileMapper } from '../mappers/file.mapper';
import { NullableType } from '@src/utils/types/nullable.type';

@Injectable()
export class FileDocumentRepository implements FileRepository {
  constructor(
    @InjectModel(FileSchemaClass.name)
    private fileModel: Model<FileSchemaClass>,
  ) {}

  async create(data: Omit<FileType, 'id'>): Promise<FileType> {
    console.log('data ->', data);
    const createdFile = new this.fileModel(data);
    const fileObject = await createdFile.save();
    console.log('fileObject', fileObject);
    return FileMapper.toDomain(fileObject);
  }

  async findById(id: FileType['id']): Promise<NullableType<FileType>> {
    const fileObject = await this.fileModel.findById(id);
    return fileObject ? FileMapper.toDomain(fileObject) : null;
  }
}
