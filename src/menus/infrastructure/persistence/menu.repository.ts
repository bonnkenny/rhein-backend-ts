import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Menu } from '../../domain/menu';

export abstract class MenuRepository {
  abstract create(
    data: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Menu>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Menu[]>;

  abstract findById(id: Menu['id']): Promise<NullableType<Menu>>;

  abstract update(
    id: Menu['id'],
    payload: DeepPartial<Menu>,
  ): Promise<Menu | null>;

  abstract remove(id: Menu['id']): Promise<void>;
}
