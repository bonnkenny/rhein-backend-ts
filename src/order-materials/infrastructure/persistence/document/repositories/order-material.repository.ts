import { Injectable } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OrderMaterialSchemaClass } from '../entities/order-material.schema';
import { OrderMaterialRepository } from '../../order-material.repository';
import { OrderMaterial } from '../../../../domain/order-material';
import { OrderMaterialMapper } from '../mappers/order-material.mapper';
import { FindAllOrderMaterialsDto } from '@src/order-materials/dto/find-all-order-materials.dto';

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
    const total = await this.orderMaterialModel.countDocuments();
    const where: FilterQuery<OrderMaterialSchemaClass> = {};
    if (filterOptions?.orderId) {
      console.log('filterOptions.orderId', filterOptions.orderId);
      where.orderId = filterOptions.orderId;
    }
    const entityObjects = await this.orderMaterialModel
      .find()
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
    const entityObject = await this.orderMaterialModel.findById(id);
    return entityObject ? OrderMaterialMapper.toDomain(entityObject) : null;
  }

  async update(
    id: OrderMaterial['id'],
    payload: Partial<OrderMaterial>,
  ): Promise<NullableType<OrderMaterial>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.orderMaterialModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.orderMaterialModel.findOneAndUpdate(
      filter,
      OrderMaterialMapper.toPersistence({
        ...OrderMaterialMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? OrderMaterialMapper.toDomain(entityObject) : null;
  }

  async remove(id: OrderMaterial['id']): Promise<void> {
    await this.orderMaterialModel.deleteOne({ _id: id });
  }
}
