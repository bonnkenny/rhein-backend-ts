import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { User } from '../../domain/user';

import { FilterUserDto } from '../../dto/query-user.dto';

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

  abstract findManyWithPagination(
    filterOptions: FilterUserDto,
  ): Promise<[User[], number]>;

  abstract findAdmins(
    filterOptions: Omit<FilterUserDto, 'page' | 'limit'>,
  ): Promise<User[]>;

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

  abstract findByFilter(
    filter: Omit<FilterUserDto, 'page' | 'limit'>,
  ): Promise<NullableType<User>>;
}
