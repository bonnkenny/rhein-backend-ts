import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { Order } from '../../domain/order';
import { FilterOrdersDto } from '@src/orders/dto/filter-orders.dto';

export abstract class OrderRepository {
  abstract create(
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Order>;

  abstract findAllWithPagination(
    filterOrderOptions: FilterOrdersDto,
  ): Promise<[Order[], number]>;

  abstract findById(id: Order['id']): Promise<NullableType<Order>>;

  abstract update(
    id: Order['id'],
    payload: DeepPartial<Order>,
  ): Promise<Order | null>;

  abstract remove(id: Order['id']): Promise<void>;
}
