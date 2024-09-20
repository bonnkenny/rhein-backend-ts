import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderMaterialSchemaClass } from '../entities/order-material.schema';
import { OrderMaterialRepository } from '../../order-material.repository';
import { OrderMaterial } from '../../../../domain/order-material';
import { OrderMaterialMapper } from '../mappers/order-material.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

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
    const createdEntity = new this.orderMaterialModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return OrderMaterialMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[OrderMaterial[], number]> {
    const total = await this.orderMaterialModel.countDocuments();

    const entityObjects = await this.orderMaterialModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

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
