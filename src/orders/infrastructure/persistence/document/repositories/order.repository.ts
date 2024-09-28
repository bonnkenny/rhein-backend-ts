import { Injectable, NotFoundException } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OrderSchemaClass } from '../entities/order.schema';
import { OrderRepository } from '../../order.repository';
import { Order } from '../../../../domain/order';
import { OrderMapper } from '../mappers/order.mapper';
import { FilterOrdersDto } from '@src/orders/dto/filter-orders.dto';
import { errorBody } from '@src/utils/infinity-response';
import { toMongoId } from '@src/utils/functions';
import { omit } from 'lodash';

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
    if (filterOrderOptions.parentId) {
      where.parentId = toMongoId(filterOrderOptions.parentId);
    }
    if (filterOrderOptions.fillStatus) {
      where.fillStatus = filterOrderOptions.fillStatus;
    }
    if (filterOrderOptions.checkStatus) {
      where.checkStatus = filterOrderOptions.checkStatus;
    }
    if (!!filterOrderOptions.userId && !!filterOrderOptions.fromUserId) {
      where.$or = [
        { userId: toMongoId(filterOrderOptions.userId) },
        { fromUserId: toMongoId(filterOrderOptions.fromUserId) },
      ];
    } else {
      if (!!filterOrderOptions.userId) {
        where.userId = toMongoId(filterOrderOptions.userId);
      }
      if (!!filterOrderOptions.fromUserId) {
        where.fromUserId = toMongoId(filterOrderOptions.fromUserId);
      }
    }

    if (filterOrderOptions.orderType) {
      where.orderType = filterOrderOptions.orderType;
    }

    if (filterOrderOptions.orderNo) {
      where.orderNo = new RegExp(`.*${filterOrderOptions.orderNo}.*`, 'i');
    }
    if (filterOrderOptions.orderName) {
      where.orderName = new RegExp(`.*${filterOrderOptions.orderName}.*`, 'i');
    }

    if (filterOrderOptions.ids) {
      where._id = { $in: filterOrderOptions.ids.map(toMongoId) };
    }

    // console.log('where', where);
    const total = await this.orderModel.find(where).countDocuments();
    const entityObjects = await this.orderModel
      .find(where)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
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
      throw new NotFoundException(errorBody('Order not found'));
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

  async findAllBySupplier(
    filterOptions: FilterOrdersDto,
  ): Promise<[Order[], number]> {
    const options = omit(filterOptions, ['page', 'limit']);
    const { page, limit } = filterOptions;
    const { userId, fromUserId, parentId } = options;
    const where: FilterQuery<OrderSchemaClass> = {};

    if (!!parentId) {
      where.parentId = toMongoId(parentId);
    }

    if (!!userId && !!fromUserId) {
      where.$or = [
        { userId: toMongoId(userId) },
        { fromUserId: toMongoId(fromUserId) },
      ];
    } else {
      if (!!userId) {
        where.userId = toMongoId(userId);
      }
      if (!!fromUserId) {
        where.fromUserId = toMongoId(fromUserId);
      }
    }
    const omitOptions = omit(options, ['fromUserId', 'parentId', 'userId']);
    Object.keys(omitOptions).forEach((key) => {
      console.log('key', key);
      if (!!omitOptions[key]) {
        switch (true) {
          case ['orderNo', 'orderName'].includes(key):
            where[key] = new RegExp(`.*${omitOptions[key]}.*`, 'i');
            break;
          default:
            where[key] = omitOptions[key];
        }
      }
    });

    const total = await this.orderModel.find(where).countDocuments();
    const entityObjects = await this.orderModel
      .find(where)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .limit(limit);
    return [entityObjects.map((item) => OrderMapper.toDomain(item)), total];
  }
}
