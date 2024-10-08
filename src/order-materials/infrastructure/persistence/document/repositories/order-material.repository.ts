import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OrderMaterialSchemaClass } from '../entities/order-material.schema';
import { OrderMaterialRepository } from '../../order-material.repository';
import { OrderMaterial } from '../../../../domain/order-material';
import { OrderMaterialMapper } from '../mappers/order-material.mapper';
import { FindAllOrderMaterialsDto } from '@src/order-materials/dto/find-all-order-materials.dto';
import { isValidMongoId, toMongoId } from '@src/utils/functions';
import { pick } from 'lodash';
import { UpdateOrderMaterialStatusDto } from '@src/order-materials/dto/update-order-material.dto';
import { OrderStatusEnum } from '@src/utils/enums/order-type.enum';
import { errorBody } from '@src/utils/infinity-response';
import { OrderSchemaClass } from '@src/orders/infrastructure/persistence/document/entities/order.schema';

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
    const createdEntity = new this.orderMaterialModel(persistenceModel);

    const entityObject = await createdEntity.save();
    // console.log('to domain >>', toDomain);
    return OrderMaterialMapper.toDomain(entityObject);
  }

  async findAllWithPagination(
    filterOptions: FindAllOrderMaterialsDto,
  ): Promise<[OrderMaterial[], number]> {
    const where: FilterQuery<OrderMaterialSchemaClass> = {};
    if (isValidMongoId(filterOptions?.orderId)) {
      where.orderId = toMongoId(filterOptions.orderId);
    }
    if (!!filterOptions?.orderType) {
      where.orderType = filterOptions.orderType;
    }
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
    isCheck?: boolean,
  ): Promise<NullableType<OrderMaterial>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.orderMaterialModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }
    let update: object;
    if (isCheck === true) {
      update = pick(clonedPayload, ['checkStatus', 'reason']);
    } else {
      let updateBody = {
        ...OrderMaterialMapper.toDomain(entity),
        ...clonedPayload,
      };
      if (!!entity?.filledAt) {
        updateBody = { ...updateBody, filledAt: new Date() };
      }
      delete updateBody?.reason;
      delete updateBody?.checkStatus;
      update = OrderMaterialMapper.toPersistence(updateBody);
    }
    const entityObject = await this.orderMaterialModel.findOneAndUpdate(
      filter,
      update,
      { new: true },
    );
    return entityObject ? OrderMaterialMapper.toDomain(entityObject) : null;
  }

  async updateCheckStatus(
    id: OrderMaterial['id'],
    updateBody: UpdateOrderMaterialStatusDto,
  ): Promise<NullableType<OrderMaterial>> {
    const entity = await this.orderMaterialModel.findOne({ _id: id });

    if (!entity) {
      throw new Error('Record not found');
    }
    const otherMaterials = await this.orderMaterialModel.find({
      orderId: entity.orderId,
      checkStatus: 'PENDING',
      _id: { $ne: id },
    });
    const rejectedCount = otherMaterials.filter(
      (material) => material.checkStatus === OrderStatusEnum.REJECTED,
    ).length;

    const pendingCount = otherMaterials.filter(
      (material) => material.checkStatus === OrderStatusEnum.PENDING,
    ).length;
    const currentStatus = updateBody.checkStatus;
    const session = await this.orderMaterialModel.db.startSession();
    let entityObject: any;
    session.startTransaction();
    try {
      entityObject = await this.orderMaterialModel.findOneAndUpdate(
        { _id: id },
        updateBody,
        { new: false },
      );
      if (pendingCount === 0) {
        if (currentStatus === OrderStatusEnum.APPROVED && rejectedCount === 0) {
          //更新订单状态为APPROVED
          await this.orderModel.findOneAndUpdate(
            { _id: entity.orderId },
            { status: OrderStatusEnum.APPROVED },
            { new: false },
          );
        } else {
          //更新订单状态为REJECTED
          await this.orderModel.findOneAndUpdate(
            { _id: entity.orderId },
            { status: OrderStatusEnum.REJECTED },
            { new: false },
          );
        }
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log('transaction error', error);
      throw new InternalServerErrorException(
        errorBody('Update failed,please retry later'),
      );
    }

    return entityObject ? OrderMaterialMapper.toDomain(entityObject) : null;
  }

  async remove(id: OrderMaterial['id']): Promise<void> {
    await this.orderMaterialModel.deleteOne({ _id: id });
  }
}
