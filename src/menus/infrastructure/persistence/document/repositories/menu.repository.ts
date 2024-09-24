import { Injectable } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuSchemaClass } from '../entities/menu.schema';
import { MenuRepository } from '../../menu.repository';
import { Menu } from '@src/menus/domain/menu';
import { MenuMapper } from '../mappers/menu.mapper';
import { FilterMenuOptionsDto } from '@src/menus/dto/filter-menu-options.dto';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { errorBody } from '@src/utils/infinity-response';

@Injectable()
export class MenuDocumentRepository implements MenuRepository {
  constructor(
    @InjectModel(MenuSchemaClass.name)
    private readonly menuModel: Model<MenuSchemaClass>,
  ) {}

  async create(data: Menu): Promise<Menu> {
    const persistenceModel = MenuMapper.toPersistence(data);
    const { parentId } = persistenceModel || {};
    if (!!parentId) {
      const parent = await this.menuModel.findById(parentId);
      if (!parent) {
        throw new BadRequestException(errorBody('Parent menu not found'));
      }
    }
    const createdEntity = new this.menuModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return MenuMapper.toDomain(entityObject);
  }

  async findAllWithPagination(
    filterOptions: FilterMenuOptionsDto,
  ): Promise<[Menu[], number]> {
    const { page, limit } = filterOptions;
    const entityObjects = await this.menuModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await this.menuModel.countDocuments();
    return [
      entityObjects.map((entityObject) => MenuMapper.toDomain(entityObject)),
      total,
    ];
  }

  async findById(id: Menu['id']): Promise<NullableType<Menu>> {
    const entityObject = await this.menuModel.findById(id);
    return entityObject ? MenuMapper.toDomain(entityObject) : null;
  }

  async update(
    id: Menu['id'],
    payload: Partial<Menu>,
  ): Promise<NullableType<Menu>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.menuModel.findOne(filter);

    if (!entity) {
      throw new BadRequestException(errorBody('Record not found'));
    }

    const { parentId } = payload || {};
    if (!!parentId && parentId != entity.parentId.toString()) {
      const parent = await this.menuModel.findById(parentId);
      if (!parent) {
        throw new BadRequestException(errorBody('Parent menu not found'));
      }
    }

    const entityObject = await this.menuModel.findOneAndUpdate(
      filter,
      MenuMapper.toPersistence({
        ...MenuMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? MenuMapper.toDomain(entityObject) : null;
  }

  async remove(id: Menu['id']): Promise<void> {
    await this.menuModel.deleteOne({ _id: id });
  }
}
