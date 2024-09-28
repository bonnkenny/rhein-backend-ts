import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { orderUser } from '../../domain/order-user';
import { FindAllorderUsersDto } from '../../dto/find-all-order-users.dto';

export abstract class orderUserRepository {
  abstract create(
    data: Omit<orderUser, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<orderUser>;

  abstract findAllWithPagination(
    filterOptions: FindAllorderUsersDto,
  ): Promise<[orderUser[], number]>;

  abstract findById(id: orderUser['id']): Promise<NullableType<orderUser>>;

  abstract update(
    id: orderUser['id'],
    payload: DeepPartial<orderUser>,
  ): Promise<orderUser | null>;

  abstract remove(id: orderUser['id']): Promise<void>;
}
