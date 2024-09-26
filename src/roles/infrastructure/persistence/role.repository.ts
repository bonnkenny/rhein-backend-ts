import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { Role } from '../../domain/role';
import { FilterRolesOptionDto } from '@src/roles/dto/filter-roles-option.dto';

export abstract class RoleRepository {
  abstract create(
    data: Omit<
      Role,
      'id' | 'description' | 'status' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<Role>;

  abstract findAllWithPagination(
    filterOptions: FilterRolesOptionDto,
  ): Promise<[Role[], number]>;

  abstract findById(id: Role['id']): Promise<NullableType<Role>>;

  abstract update(
    id: Role['id'],
    payload: DeepPartial<Role>,
  ): Promise<Role | null>;

  abstract remove(id: Role['id']): Promise<void>;

  abstract findAll({
    filterOptions,
  }: {
    filterOptions: FilterRolesOptionDto | null | undefined;
  }): Promise<Role[]>;
}
