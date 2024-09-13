import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoseSchemaClass } from '../entities/rose.schema';
import { RoseRepository } from '../../rose.repository';
import { Rose } from '../../../../domain/rose';
import { RoseMapper } from '../mappers/rose.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import {
  MenuModel,
  // MenuSchemaClass,
} from '@src/menus/infrastructure/persistence/document/entities/menu.schema';

@Injectable()
export class RoseDocumentRepository implements RoseRepository {
  constructor(
    @InjectModel(RoseSchemaClass.name)
    private readonly roseModel: Model<RoseSchemaClass>,
  ) {}

  async create(data: Rose): Promise<Rose> {
    const persistenceModel = RoseMapper.toPersistence(data);
    const createdEntity = new this.roseModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return RoseMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Rose[]> {
    const entityObjects = await this.roseModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .populate({
        model: MenuModel,
        path: 'menus',
      })
      .exec();

    console.log('entityObjects', entityObjects);

    return entityObjects.map((entityObject) =>
      RoseMapper.toDomain(entityObject),
    );
  }

  async findById(id: Rose['id']): Promise<NullableType<Rose>> {
    const entityObject = await this.roseModel.findById(id);
    return entityObject ? RoseMapper.toDomain(entityObject) : null;
  }

  async update(
    id: Rose['id'],
    payload: Partial<Rose>,
  ): Promise<NullableType<Rose>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.roseModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }
    const entityObject = await this.roseModel.findOneAndUpdate(
      filter,
      RoseMapper.toPersistence({
        ...RoseMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? RoseMapper.toDomain(entityObject) : null;
  }

  async remove(id: Rose['id']): Promise<void> {
    await this.roseModel.deleteOne({ _id: id });
  }
}
