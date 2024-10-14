import { Injectable } from '@nestjs/common';

import { FileRepository } from '../../file.repository';
import { FileSchemaClass } from '../entities/file.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { FileType } from '@src/files/domain/file';

import { FileMapper } from '../mappers/file.mapper';
import { NullableType } from '@src/utils/types/nullable.type';
import { FilterFileDto } from '@src/files/dto/FilterFileDto';

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
  async findByFilter(filter: FilterFileDto): Promise<NullableType<FileType>> {
    const where: FilterQuery<FileSchemaClass> = {};
    Object.keys(filter).forEach((key) => {
      if (!!filter[key]) {
        where[key] = filter[key];
      }
    });
    if (!where) {
      return null;
    }
    const entity = await this.fileModel.findOne(where);
    return entity ? FileMapper.toDomain(entity) : null;
  }
}
