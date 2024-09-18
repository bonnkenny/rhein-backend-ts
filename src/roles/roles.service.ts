import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './infrastructure/persistence/role.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Role } from './domain/role';
import { NullableType } from '@src/utils/types/nullable.type';
import { FindAllRolesDto } from '@src/roles/dto/find-all-roles.dto';
import { Menu, MenuTree } from '@src/menus/domain/menu';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  create(createRoleDto: CreateRoleDto): Promise<Role> {
    // console.log('service CreateRoleDto', CreateRoleDto);
    return this.roleRepository.create(createRoleDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.roleRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Role['id']): Promise<NullableType<Role>> {
    return this.roleRepository.findById(id);
  }

  update(id: Role['id'], updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  remove(id: Role['id']) {
    return this.roleRepository.remove(id);
  }

  async getMenuTree(
    filterOptions: FindAllRolesDto | null | undefined,
  ): Promise<MenuTree[]> {
    const roles = await this.roleRepository.findAll({
      filterOptions: filterOptions ?? null,
    });
    console.log('roles >>>', roles);
    const menuArr: Menu[] = [];
    const menusIds: Set<string> = new Set();
    roles.forEach((role) => {
      const { menus = [] } = role;
      menus.forEach((menu) => {
        // console.log('menu >>', menu);
        if (!menusIds.has(menu.id)) {
          menusIds.add(menu.id);
          menuArr.push(menu);
        }
      });
    });
    // console.log('menus >>>', menuArr);
    const menuMap: Map<string, MenuTree> = new Map();
    menuArr.forEach((menu) => {
      const menuTree: MenuTree = {
        ...menu,
        children: [], // 初始化 children 为空数组
      };
      menuMap.set(menu.id, menuTree);
    });
    const buildMenuTree = (
      menus: Menu[],
      menuMap: Map<string, MenuTree>,
      parentId?: string,
    ): MenuTree[] => {
      const children: MenuTree[] = [];
      menus.forEach((menu) => {
        if (menu?.parentId === parentId) {
          const menuTree = menuMap.get(menu.id)!;
          menuTree.children = buildMenuTree(menus, menuMap, menu.id);
          children.push(menuTree);
        }
      });
      return children;
    };

    return buildMenuTree(menuArr, menuMap);
  }
}
