import { Injectable } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderMaterialTemplateSchemaClass } from '../entities/order-material-template.schema';
import { OrderMaterialTemplateRepository } from '../../order-material-template.repository';
import { OrderMaterialTemplate } from '../../../../domain/order-material-template';
import { OrderMaterialTemplateMapper } from '../mappers/order-material-template.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class OrderMaterialTemplateDocumentRepository
  implements OrderMaterialTemplateRepository
{
  constructor(
    @InjectModel(OrderMaterialTemplateSchemaClass.name)
    private readonly orderMaterialTemplateModel: Model<OrderMaterialTemplateSchemaClass>,
  ) {}

  async create(data: OrderMaterialTemplate): Promise<OrderMaterialTemplate> {
    const persistenceModel = OrderMaterialTemplateMapper.toPersistence(data);
    const createdEntity = new this.orderMaterialTemplateModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return OrderMaterialTemplateMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[OrderMaterialTemplate[], number]> {
    const total = await this.orderMaterialTemplateModel.countDocuments();
    const entityObjects = await this.orderMaterialTemplateModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return [
      entityObjects.map((entityObject) =>
        OrderMaterialTemplateMapper.toDomain(entityObject),
      ),
      total,
    ];
  }

  async findById(
    id: OrderMaterialTemplate['id'],
  ): Promise<NullableType<OrderMaterialTemplate>> {
    const entityObject = await this.orderMaterialTemplateModel.findById(id);
    return entityObject
      ? OrderMaterialTemplateMapper.toDomain(entityObject)
      : null;
  }

  async update(
    id: OrderMaterialTemplate['id'],
    payload: Partial<OrderMaterialTemplate>,
  ): Promise<NullableType<OrderMaterialTemplate>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.orderMaterialTemplateModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.orderMaterialTemplateModel.findOneAndUpdate(
      filter,
      OrderMaterialTemplateMapper.toPersistence({
        ...OrderMaterialTemplateMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject
      ? OrderMaterialTemplateMapper.toDomain(entityObject)
      : null;
  }

  async remove(id: OrderMaterialTemplate['id']): Promise<void> {
    await this.orderMaterialTemplateModel.deleteOne({ _id: id });
  }
}
