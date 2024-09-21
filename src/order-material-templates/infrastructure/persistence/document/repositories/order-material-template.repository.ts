import { Injectable, NotFoundException } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderMaterialTemplateSchemaClass } from '../entities/order-material-template.schema';
import { OrderMaterialTemplateRepository } from '../../order-material-template.repository';
import { OrderMaterialTemplate } from '../../../../domain/order-material-template';
import { OrderMaterialTemplateMapper } from '../mappers/order-material-template.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { CreateOrderMaterialColumnDto } from '@src/order-material-columns/dto/create-order-material-column.dto';
import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';
import { errorBody } from '@src/utils/infinity-response';

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
    const { columns } = persistenceModel;
    const formattedColumns: Array<Array<OrderMaterialColumn>> = [];

    for (const column of columns) {
      formattedColumns.push(this.formatColumns(column));
    }
    persistenceModel.columns = formattedColumns;
    persistenceModel.filledAt = null;
    const createdEntity = new this.orderMaterialTemplateModel(persistenceModel);

    const entityObject = await createdEntity.save();
    // console.log('to domain >>', toDomain);
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
      throw new NotFoundException(
        errorBody('Order material template not found'),
      );
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

  formatColumns(columns: CreateOrderMaterialColumnDto[]): any[] {
    return columns;
  }

  async findAll({
    orderType,
  }: {
    orderType: OrderMaterialTemplate['orderType'];
  }): Promise<OrderMaterialTemplate[]> {
    const items = await this.orderMaterialTemplateModel.find({ orderType });

    return items.map((item) => OrderMaterialTemplateMapper.toDomain(item));
  }
}
