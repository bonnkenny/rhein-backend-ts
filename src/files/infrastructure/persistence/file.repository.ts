import { NullableType } from '@src/utils/types/nullable.type';
import { FileType } from '../../domain/file';
import { FilterFileDto } from '@src/files/dto/FilterFileDto';

export abstract class FileRepository {
  abstract create(data: Omit<FileType, 'id'>): Promise<FileType>;

  abstract findById(id: FileType['id']): Promise<NullableType<FileType>>;
  abstract findByFilter(filter: FilterFileDto): Promise<NullableType<FileType>>;
}
