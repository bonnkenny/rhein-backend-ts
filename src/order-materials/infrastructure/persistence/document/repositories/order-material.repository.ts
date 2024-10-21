import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OrderMaterialSchemaClass } from '../entities/order-material.schema';
import { OrderMaterialRepository } from '../../order-material.repository';
import { OrderMaterial } from '../../../../domain/order-material';
import { OrderMaterialMapper } from '../mappers/order-material.mapper';
import { FindAllOrderMaterialsDto } from '@src/order-materials/dto/find-all-order-materials.dto';
import { toMongoId } from '@src/utils/functions';
import { omit, pick } from 'lodash';
import { UpdateOrderMaterialStatusDto } from '@src/order-materials/dto/update-order-material.dto';
import {
  OrderFillStatusEnum,
  OrderCheckStatusEnum,
  OrderStatusEnum,
} from '@src/utils/enums/order-type.enum';
import { errorBody } from '@src/utils/infinity-response';
import { OrderSchemaClass } from '@src/orders/infrastructure/persistence/document/entities/order.schema';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class OrderMaterialDocumentRepository
  implements OrderMaterialRepository
{
  constructor(
    @InjectModel(OrderMaterialSchemaClass.name)
    private readonly orderMaterialModel: Model<OrderMaterialSchemaClass>,

    @InjectModel(OrderSchemaClass.name)
    private readonly orderModel: Model<OrderSchemaClass>,
  ) {}

  async create(data: OrderMaterial): Promise<OrderMaterial> {
    const persistenceModel = OrderMaterialMapper.toPersistence(data);
    persistenceModel.filledAt = null;
    persistenceModel.isOptionalCustom = persistenceModel.isOptional;
    const createdEntity = new this.orderMaterialModel(persistenceModel);

    const entityObject = await createdEntity.save();
    // console.log('to domain >>', toDomain);
    return OrderMaterialMapper.toDomain(entityObject);
  }

  async findAllWithPagination(
    filterOptions: FindAllOrderMaterialsDto,
  ): Promise<[OrderMaterial[], number]> {
    const where: FilterQuery<OrderMaterialSchemaClass> = {};
    const params = omit(filterOptions, ['page', 'limit']);

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ''
      ) {
        switch (true) {
          case key === 'id':
            where['_id'] = toMongoId(params[key]);
            break;
          case key === 'orderId':
            where['orderId'] = toMongoId(params[key]);
            break;
          default:
            where[key] = params[key];
        }
      }
    });
    console.log('where ->', where);
    const total = await this.orderMaterialModel.find(where).countDocuments();
    const entityObjects = await this.orderMaterialModel
      .find(where)
      .skip((filterOptions.page - 1) * filterOptions.limit)
      .limit(filterOptions.limit);

    return [
      entityObjects.map((entityObject) =>
        OrderMaterialMapper.toDomain(entityObject),
      ),
      total,
    ];
  }

  async findById(
    id: OrderMaterial['id'],
  ): Promise<NullableType<OrderMaterial>> {
    const entityObject = await this.orderMaterialModel
      .findById(id)
      .populate({ path: 'order' });
    return entityObject ? OrderMaterialMapper.toDomain(entityObject) : null;
  }

  async update(
    id: OrderMaterial['id'],
    payload: Partial<OrderMaterial>,
  ): Promise<NullableType<OrderMaterial>> {
    const clonedPayload = pick(payload, ['columns']);

    const filter = { _id: id.toString() };
    const entity = await this.orderMaterialModel.findOne(filter);

    if (!entity) {
      throw new NotFoundException(errorBody('Record not found'));
    }
    if (entity.checkStatus === OrderCheckStatusEnum.APPROVED) {
      throw new BadRequestException(errorBody('Material has been approved'));
    }
    let updateBody = {
      ...OrderMaterialMapper.toDomain(entity),
      ...clonedPayload,
    };
    if (!entity?.filledAt) {
      updateBody = { ...updateBody, filledAt: new Date() };
    }
    if (entity.checkStatus === OrderCheckStatusEnum.REJECTED) {
      updateBody = { ...updateBody, checkStatus: OrderCheckStatusEnum.PENDING };
    }

    const update = OrderMaterialMapper.toPersistence(updateBody);

    const otherMaterial = await this.orderMaterialModel.find({
      orderId: entity.orderId,
      isOptional: false,
      filledAt: { $eq: null },
      _id: { $ne: id },
    });

    let entityObject: any;
    // const dbSession = await this.orderMaterialModel.db.startSession();
    // dbSession.startTransaction();
    try {
      entityObject = await this.orderMaterialModel.findOneAndUpdate(
        filter,
        update,
        { new: true },
      );
      if (otherMaterial.length === 0) {
        await this.orderModel.findOneAndUpdate(
          { _id: entity.orderId },
          {
            fillStatus: OrderFillStatusEnum.FILLED,
            status: OrderStatusEnum.COLLECTING,
          },
          { new: false },
        );
        console.log('here-4');
      }
      // await dbSession.commitTransaction();
    } catch (error) {
      // await dbSession.abortTransaction();
      console.log('transaction error->', error);
      throw new InternalServerErrorException(
        errorBody('Update error,please try again!'),
      );
    }

    return entityObject ? OrderMaterialMapper.toDomain(entityObject) : null;
  }

  async updateCheckStatus(
    id: OrderMaterial['id'],
    updateBody: UpdateOrderMaterialStatusDto,
  ): Promise<NullableType<OrderMaterial>> {
    const entity = await this.orderMaterialModel.findOne({ _id: id });
    if (!entity) {
      throw new NotFoundException(errorBody('Record not found'));
    }
    const otherMaterials = await this.orderMaterialModel.find({
      orderId: entity.orderId,
      checkStatus: 'PENDING',
      _id: { $ne: id },
    });
    // console.log(
    //   'other materials ->',
    //   otherMaterials.map((material) => material.id.toString()),
    // );
    // console.log('other materials count ->', otherMaterials.length);
    const rejectedCount = otherMaterials.filter(
      (material) => material.checkStatus === OrderCheckStatusEnum.REJECTED,
    ).length;

    const pendingCount = otherMaterials.filter(
      (material) =>
        material.checkStatus === OrderCheckStatusEnum.PENDING &&
        !material?.isOptional,
    ).length;
    const currentStatus = updateBody.checkStatus;
    // const session = await this.orderMaterialModel.db.startSession();
    let entityObject: any;
    // session.startTransaction();
    try {
      entityObject = await this.orderMaterialModel.findOneAndUpdate(
        { _id: id },
        updateBody,
        { new: false },
      );
      if (pendingCount === 0) {
        if (
          currentStatus === OrderCheckStatusEnum.APPROVED &&
          rejectedCount === 0
        ) {
          // console.log('order update ->', entity.orderId);
          //更新订单状态为APPROVED
          await this.orderModel.findOneAndUpdate(
            { _id: entity.orderId },
            {
              checkStatus: OrderCheckStatusEnum.APPROVED,
              status: OrderStatusEnum.REPORTING,
            },
            { new: false },
          );
        } else {
          //更新订单状态为REJECTED
          await this.orderModel.findOneAndUpdate(
            { _id: entity.orderId },
            {
              checkStatus: OrderCheckStatusEnum.REJECTED,
              status: OrderStatusEnum.COLLECTING,
            },
            { new: false },
          );
        }
      }

      // await session.commitTransaction();
    } catch (error) {
      // await session.abortTransaction();
      console.log('transaction error', error);
      throw new InternalServerErrorException(
        errorBody('Update failed,please retry later'),
      );
    }

    return entityObject ? OrderMaterialMapper.toDomain(entityObject) : null;
  }

  async setCustomOptional(ids: Array<OrderMaterial['id']>) {
    const entities = await this.orderMaterialModel.find({ _id: { $in: ids } });
    const orderIdSet: Set<OrderMaterial['orderId']> = new Set();
    entities.map((entity) => orderIdSet.add(entity?.orderId?.toString()));
    if (orderIdSet.size > 1) {
      throw new UnprocessableEntityException(
        errorBody('Cant set materials across orders'),
      );
    }
    const orderId = [...orderIdSet][0];
    const orderEntity = await this.orderModel.findById(orderId);
    if (!orderEntity) {
      throw new NotFoundException(errorBody('Order not found'));
    }

    if (orderEntity.checkStatus === OrderCheckStatusEnum.APPROVED) {
      throw new UnprocessableEntityException(
        errorBody('Order has been approved'),
      );
    }
    try {
      await this.orderMaterialModel.updateMany(
        { _id: { $in: ids.map(toMongoId) } },
        { isOptionalCustom: true },
      );
      await this.orderMaterialModel.updateMany(
        { _id: { $nin: ids.map(toMongoId) } },
        { isOptionalCustom: false },
      );
      await this.orderModel.findOneAndUpdate(
        { _id: orderId },
        { customerOptionalCheck: OrderCheckStatusEnum.PENDING },
        { new: false },
      );
    } catch (e) {
      console.log('error', e);
      throw new InternalServerErrorException(errorBody('Update failed'));
    }
    return true;
  }

  async remove(id: OrderMaterial['id']): Promise<void> {
    await this.orderMaterialModel.deleteOne({ _id: id });
  }
}
