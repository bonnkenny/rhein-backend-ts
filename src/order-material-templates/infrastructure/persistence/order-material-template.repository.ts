import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { OrderMaterialTemplate } from '../../domain/order-material-template';

export abstract class OrderMaterialTemplateRepository {
  abstract create(
    data: Omit<OrderMaterialTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<OrderMaterialTemplate>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<OrderMaterialTemplate[]>;

  abstract findById(
    id: OrderMaterialTemplate['id'],
  ): Promise<NullableType<OrderMaterialTemplate>>;

  abstract update(
    id: OrderMaterialTemplate['id'],
    payload: DeepPartial<OrderMaterialTemplate>,
  ): Promise<OrderMaterialTemplate | null>;

  abstract remove(id: OrderMaterialTemplate['id']): Promise<void>;
}
