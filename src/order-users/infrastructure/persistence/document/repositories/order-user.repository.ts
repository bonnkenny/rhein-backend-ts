import { Injectable } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { orderUserSchemaClass } from '../entities/order-user.schema';
import { orderUserRepository } from '../../order-user.repository';
import { orderUser } from '../../../../domain/order-user';
import { orderUserMapper } from '../mappers/order-user.mapper';
import { FindAllorderUsersDto } from '../../../../dto/find-all-order-users.dto';

@Injectable()
export class orderUserDocumentRepository implements orderUserRepository {
  constructor(
    @InjectModel(orderUserSchemaClass.name)
    private readonly orderUserModel: Model<orderUserSchemaClass>,
  ) {}

  async create(data: orderUser): Promise<orderUser> {
    const persistenceModel = orderUserMapper.toPersistence(data);
    const createdEntity = new this.orderUserModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return orderUserMapper.toDomain(entityObject);
  }

  async findAllWithPagination(
    filterOptions: FindAllorderUsersDto,
  ): Promise<[orderUser[], number]> {
    const { page, limit } = filterOptions;

    const where: FilterQuery<orderUserSchemaClass> = {};

    const totalCount = await this.orderUserModel.find(where).countDocuments();

    const entityObjects = await this.orderUserModel
      .find(where)
      .skip((page - 1) * limit)
      .limit(limit);

    const items = entityObjects.map((entityObject) =>
      orderUserMapper.toDomain(entityObject),
    );
    return [items, totalCount];
  }

  async findById(id: orderUser['id']): Promise<NullableType<orderUser>> {
    const entityObject = await this.orderUserModel.findById(id);
    return entityObject ? orderUserMapper.toDomain(entityObject) : null;
  }

  async update(
    id: orderUser['id'],
    payload: Partial<orderUser>,
  ): Promise<NullableType<orderUser>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.orderUserModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.orderUserModel.findOneAndUpdate(
      filter,
      orderUserMapper.toPersistence({
        ...orderUserMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? orderUserMapper.toDomain(entityObject) : null;
  }

  async remove(id: orderUser['id']): Promise<void> {
    await this.orderUserModel.deleteOne({ _id: id });
  }
}
