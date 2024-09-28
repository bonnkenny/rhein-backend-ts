import { Injectable } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OrderUserSchemaClass } from '../entities/order-user.schema';
import { orderUserRepository } from '../../order-user.repository';
import { orderUser } from '../../../../domain/order-user';
import { OrderUserMapper } from '../mappers/order-user.mapper';
import { FindAllOrderUsersDto } from '../../../../dto/find-all-order-users.dto';
import { toMongoId } from '@src/utils/functions';

@Injectable()
export class OrderUserDocumentRepository implements orderUserRepository {
  constructor(
    @InjectModel(OrderUserSchemaClass.name)
    private readonly orderUserModel: Model<OrderUserSchemaClass>,
  ) {}

  async create(data: orderUser): Promise<orderUser> {
    const persistenceModel = OrderUserMapper.toPersistence(data);
    const createdEntity = new this.orderUserModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return OrderUserMapper.toDomain(entityObject);
  }

  async findAllWithPagination(
    filterOptions: FindAllOrderUsersDto,
  ): Promise<[orderUser[], number]> {
    const { page, limit } = filterOptions;

    const where: FilterQuery<OrderUserSchemaClass> = {};

    const totalCount = await this.orderUserModel.find(where).countDocuments();

    const entityObjects = await this.orderUserModel
      .find(where)
      .skip((page - 1) * limit)
      .limit(limit);

    const items = entityObjects.map((entityObject) =>
      OrderUserMapper.toDomain(entityObject),
    );
    return [items, totalCount];
  }

  async findAll(
    filterOptions: Omit<FindAllOrderUsersDto, 'page' | 'limit'>,
  ): Promise<orderUser[]> {
    const where: FilterQuery<OrderUserSchemaClass> = {};
    if (filterOptions.orderId) {
      where.orderId = toMongoId(filterOptions.orderId);
    }

    if (filterOptions.userId) {
      where.userId = toMongoId(filterOptions.userId);
    }

    const entityObjects = await this.orderUserModel.find(where);

    return entityObjects.map((entityObject) =>
      OrderUserMapper.toDomain(entityObject),
    );
  }

  async findById(id: orderUser['id']): Promise<NullableType<orderUser>> {
    const entityObject = await this.orderUserModel.findById(id);
    return entityObject ? OrderUserMapper.toDomain(entityObject) : null;
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
      OrderUserMapper.toPersistence({
        ...OrderUserMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? OrderUserMapper.toDomain(entityObject) : null;
  }

  async remove(id: orderUser['id']): Promise<void> {
    await this.orderUserModel.deleteOne({ _id: id });
  }
}
