import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { Order } from '../../domain/order';
import { FilterOrdersDto } from '@src/orders/dto/filter-orders.dto';
import { UpdateCustomOptionalOrderDto } from '@src/orders/dto/update-order.dto';

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

  abstract findAllBySupplier(
    filterOrderOptions: FilterOrdersDto,
  ): Promise<[Order[], number]>;

  abstract findAll(
    filterOrderOptions: Omit<FilterOrdersDto, 'page' | 'limit'>,
    withMaterials?: boolean,
  ): Promise<Order[]>;

  abstract findChainsByIds(ids: Order['id'][]): Promise<Order[]>;

  abstract findChainsFilesByIds(ids: Order['id'][]): Promise<Order[]>;

  abstract findParentIds(parentId: Order['id']): Promise<[Order['id']] | []>;
  abstract findChildrenIds(id: Order['id']): Promise<[Order['id']] | []>;

  abstract updateCustomerOptionalCheck(
    id: Order['id'],
    body: UpdateCustomOptionalOrderDto,
  );
}
