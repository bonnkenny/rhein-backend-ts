import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { OrderMaterial } from '../../domain/order-material';
import { FindAllOrderMaterialsDto } from '@src/order-materials/dto/find-all-order-materials.dto';
import { UpdateOrderMaterialStatusDto } from '@src/order-materials/dto/update-order-material.dto';

export abstract class OrderMaterialRepository {
  abstract create(
    data: Omit<OrderMaterial, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<OrderMaterial>;

  abstract findAllWithPagination(
    filterOptions: FindAllOrderMaterialsDto,
  ): Promise<[OrderMaterial[], number]>;

  abstract findById(
    id: OrderMaterial['id'],
  ): Promise<NullableType<OrderMaterial>>;

  abstract update(
    id: OrderMaterial['id'],
    payload: DeepPartial<OrderMaterial>,
    isCheck?: boolean,
  ): Promise<OrderMaterial | null>;

  abstract remove(id: OrderMaterial['id']): Promise<void>;

  abstract updateCheckStatus(
    id: OrderMaterial['id'],
    updateBody: UpdateOrderMaterialStatusDto,
  ): Promise<OrderMaterial | null>;
}
