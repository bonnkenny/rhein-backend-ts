import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Rose } from '../../domain/rose';

export abstract class RoseRepository {
  abstract create(
    data: Omit<
      Rose,
      'id' | 'name' | 'description' | 'menus' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<Rose>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Rose[]>;

  abstract findById(id: Rose['id']): Promise<NullableType<Rose>>;

  abstract update(
    id: Rose['id'],
    payload: DeepPartial<Rose>,
  ): Promise<Rose | null>;

  abstract remove(id: Rose['id']): Promise<void>;
}
