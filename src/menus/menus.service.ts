import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuRepository } from './infrastructure/persistence/menu.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Menu } from './domain/menu';

@Injectable()
export class MenusService {
  constructor(private readonly menuRepository: MenuRepository) {}

  create(createMenuDto: CreateMenuDto) {
    return this.menuRepository.create(createMenuDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.menuRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Menu['id']) {
    return this.menuRepository.findById(id);
  }

  update(id: Menu['id'], updateMenuDto: UpdateMenuDto) {
    return this.menuRepository.update(id, updateMenuDto);
  }

  remove(id: Menu['id']) {
    return this.menuRepository.remove(id);
  }
}
