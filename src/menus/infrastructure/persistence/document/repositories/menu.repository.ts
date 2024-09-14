import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuSchemaClass } from '../entities/menu.schema';
import { MenuRepository } from '../../menu.repository';
import { Menu } from '../../../../domain/menu';
import { MenuMapper } from '../mappers/menu.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MenuDocumentRepository implements MenuRepository {
  constructor(
    @InjectModel(MenuSchemaClass.name)
    private readonly menuModel: Model<MenuSchemaClass>,
  ) {}

  async create(data: Menu): Promise<Menu> {
    const persistenceModel = MenuMapper.toPersistence(data);
    const createdEntity = new this.menuModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return MenuMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[Menu[], number]> {
    const entityObjects = await this.menuModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);
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
      throw new Error('Record not found');
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
