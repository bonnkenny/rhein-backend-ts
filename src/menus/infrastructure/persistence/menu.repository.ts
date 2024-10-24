import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { Menu } from '../../domain/menu';
import { FilterMenuOptionsDto } from '@src/menus/dto/filter-menu-options.dto';

export abstract class MenuRepository {
  abstract create(
    data: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Menu>;

  abstract findAllWithPagination(
    filterOptions: FilterMenuOptionsDto,
  ): Promise<[Menu[], number]>;

  abstract findAll(): Promise<Menu[]>;

  abstract findById(id: Menu['id']): Promise<NullableType<Menu>>;

  abstract update(
    id: Menu['id'],
    payload: DeepPartial<Menu>,
  ): Promise<Menu | null>;

  abstract remove(id: Menu['id']): Promise<void>;
}
