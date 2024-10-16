import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { NewsRecords } from '../../domain/news-records';
import { FindAllNewsRecordsDto } from '../../dto/find-all-news-records.dto';
import { CreateNewsRecordsDto } from '@src/news-records/dto/create-news-records.dto';

export abstract class NewsRecordsRepository {
  abstract create(data: CreateNewsRecordsDto): Promise<NewsRecords>;

  abstract findAllWithPagination(
    filterOptions: FindAllNewsRecordsDto,
  ): Promise<[NewsRecords[], number]>;

  abstract findById(id: NewsRecords['id']): Promise<NullableType<NewsRecords>>;

  abstract update(
    id: NewsRecords['id'],
    payload: DeepPartial<NewsRecords>,
  ): Promise<NewsRecords | null>;

  abstract remove(id: NewsRecords['id']): Promise<void>;
}
