import { Injectable } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { OrderSchemaClass } from '../entities/order.schema';
import { OrderRepository } from '../../order.repository';
import { Order } from '../../../../domain/order';
import { OrderMapper } from '../mappers/order.mapper';
import { FilterOrdersDto } from '@src/orders/dto/filter-orders.dto';

@Injectable()
export class OrderDocumentRepository implements OrderRepository {
  constructor(
    @InjectModel(OrderSchemaClass.name)
    private readonly orderModel: Model<OrderSchemaClass>,
  ) {}

  async create(data: Order): Promise<Order> {
    const persistenceModel = OrderMapper.toPersistence(data);
    const createdEntity = new this.orderModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return OrderMapper.toDomain(entityObject);
  }

  async findAllWithPagination(
    filterOrderOptions: FilterOrdersDto,
  ): Promise<[Order[], number]> {
    const { page, limit } = filterOrderOptions;
    const where: FilterQuery<OrderSchemaClass> = {};
    if (filterOrderOptions.checkStatus) {
      where.checkStatus = filterOrderOptions.checkStatus;
    }
    if (filterOrderOptions.fillStatus) {
      where.fillStatus = filterOrderOptions.fillStatus;
    }
    if (filterOrderOptions.parentId) {
      where.parentId = new Types.ObjectId(filterOrderOptions.parentId);
    }
    if (filterOrderOptions.userId) {
      where.userId = new Types.ObjectId(filterOrderOptions.userId);
    }
    const total = await this.orderModel.find(where).countDocuments();
    const entityObjects = await this.orderModel
      .find(where)
      .skip((page - 1) * limit)
      .limit(limit);

    return [
      entityObjects.map((entityObject) => OrderMapper.toDomain(entityObject)),
      total,
    ];
  }

  async findById(id: Order['id']): Promise<NullableType<Order>> {
    const entityObject = await this.orderModel.findById(id);
    return entityObject ? OrderMapper.toDomain(entityObject) : null;
  }

  async update(
    id: Order['id'],
    payload: Partial<Order>,
  ): Promise<NullableType<Order>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.orderModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.orderModel.findOneAndUpdate(
      filter,
      OrderMapper.toPersistence({
        ...OrderMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? OrderMapper.toDomain(entityObject) : null;
  }

  async remove(id: Order['id']): Promise<void> {
    await this.orderModel.deleteOne({ _id: id });
  }
}
