import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { OrderMaterial } from '../../domain/order-material';

export abstract class OrderMaterialRepository {
  abstract create(
    data: Omit<OrderMaterial, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<OrderMaterial>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<OrderMaterial[]>;

  abstract findById(
    id: OrderMaterial['id'],
  ): Promise<NullableType<OrderMaterial>>;

  abstract update(
    id: OrderMaterial['id'],
    payload: DeepPartial<OrderMaterial>,
  ): Promise<OrderMaterial | null>;

  abstract remove(id: OrderMaterial['id']): Promise<void>;
}
