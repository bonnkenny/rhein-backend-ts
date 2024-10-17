import { Injectable } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { NewsRecordsSchemaClass } from '../entities/news-records.schema';
import { NewsRecordsRepository } from '../../news-records.repository';
import { NewsRecords } from '../../../../domain/news-records';
import { NewsRecordsMapper } from '../mappers/news-records.mapper';
import { FindAllNewsRecordsDto } from '../../../../dto/find-all-news-records.dto';

@Injectable()
export class NewsRecordsDocumentRepository implements NewsRecordsRepository {
  constructor(
    @InjectModel(NewsRecordsSchemaClass.name)
    private readonly newsRecordsModel: Model<NewsRecordsSchemaClass>,
  ) {}

  async create(data: NewsRecords): Promise<NewsRecords> {
    const persistenceModel = NewsRecordsMapper.toPersistence(data);
    const createdEntity = new this.newsRecordsModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return NewsRecordsMapper.toDomain(entityObject);
  }

  async findAllWithPagination(
    filterOptions: FindAllNewsRecordsDto,
  ): Promise<[NewsRecords[], number]> {
    const { page, limit } = filterOptions;

    const where: FilterQuery<NewsRecordsSchemaClass> = {};

    const totalCount = await this.newsRecordsModel.find(where).countDocuments();

    const entityObjects = await this.newsRecordsModel
      .find(where)
      .skip((page - 1) * limit)
      .limit(limit);

    const items = entityObjects.map((entityObject) =>
      NewsRecordsMapper.toDomain(entityObject),
    );
    return [items, totalCount];
  }

  async findById(id: NewsRecords['id']): Promise<NullableType<NewsRecords>> {
    const entityObject = await this.newsRecordsModel.findById(id);
    return entityObject ? NewsRecordsMapper.toDomain(entityObject) : null;
  }

  async update(
    id: NewsRecords['id'],
    payload: Partial<NewsRecords>,
  ): Promise<NullableType<NewsRecords>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.newsRecordsModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.newsRecordsModel.findOneAndUpdate(
      filter,
      NewsRecordsMapper.toPersistence({
        ...NewsRecordsMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? NewsRecordsMapper.toDomain(entityObject) : null;
  }

  async remove(id: NewsRecords['id']): Promise<void> {
    await this.newsRecordsModel.deleteOne({ _id: id });
  }
}
