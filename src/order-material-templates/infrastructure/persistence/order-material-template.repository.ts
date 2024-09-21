import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { OrderMaterialTemplate } from '../../domain/order-material-template';
import { CreateOrderMaterialColumnDto } from '@src/order-material-columns/dto/create-order-material-column.dto';
import { defaultQueryOptionsDto } from '@src/order-material-templates/dto/find-all-order-material-templates.dto';

export abstract class OrderMaterialTemplateRepository {
  abstract create(
    data: Omit<OrderMaterialTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<OrderMaterialTemplate>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[OrderMaterialTemplate[], number]>;
  abstract findAll(
    filter: defaultQueryOptionsDto,
  ): Promise<OrderMaterialTemplate[]>;
  abstract findById(
    id: OrderMaterialTemplate['id'],
  ): Promise<NullableType<OrderMaterialTemplate>>;

  abstract update(
    id: OrderMaterialTemplate['id'],
    payload: DeepPartial<OrderMaterialTemplate>,
  ): Promise<OrderMaterialTemplate | null>;

  abstract remove(id: OrderMaterialTemplate['id']): Promise<void>;

  abstract formatColumns(columns: CreateOrderMaterialColumnDto[]): any[];
}
