import { Injectable } from '@nestjs/common';
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

@Injectable()
export class OrderMaterialDocumentRepository
  implements OrderMaterialRepository
{
  constructor(
    @InjectModel(OrderMaterialSchemaClass.name)
    private readonly orderMaterialModel: Model<OrderMaterialSchemaClass>,
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
    let update: object = {};
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

  async remove(id: OrderMaterial['id']): Promise<void> {
    await this.orderMaterialModel.deleteOne({ _id: id });
  }
}
