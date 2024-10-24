import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuRepository } from './infrastructure/persistence/menu.repository';
import { Menu } from './domain/menu';
import { FilterMenuOptionsDto } from '@src/menus/dto/filter-menu-options.dto';

@Injectable()
export class MenusService {
  constructor(private readonly menuRepository: MenuRepository) {}

  create(createMenuDto: CreateMenuDto) {
    return this.menuRepository.create(createMenuDto);
  }

  findAllWithPagination(filterOptions: FilterMenuOptionsDto) {
    return this.menuRepository.findAllWithPagination(filterOptions);
  }
  findAll() {
    return this.menuRepository.findAll();
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
