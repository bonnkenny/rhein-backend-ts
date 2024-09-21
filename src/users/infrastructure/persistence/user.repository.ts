import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { User } from '../../domain/user';

import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';

export abstract class UserRepository {
  abstract create(
    data: Omit<
      User,
      | 'id'
      | 'firstName'
      | 'lastName'
      | 'baseRole'
      | 'status'
      | 'email'
      | 'password'
      | 'createdAt'
      | 'deletedAt'
      | 'updatedAt'
      | 'avatar'
      | 'socialId'
      | 'roleIds'
    >,
  ): Promise<User>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<[User[], number]>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;
  abstract findByEmail({
    email,
    withRoleMenu,
  }: {
    email: User['email'];
    withRoleMenu?: boolean;
  }): Promise<NullableType<User>>;
  abstract findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract remove(id: User['id']): Promise<void>;

  abstract findByFilter(filter: FilterUserDto): Promise<NullableType<User>>;
}
