import { Injectable } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleSchemaClass } from '../entities/role.schema';
import { RoleRepository } from '../../role.repository';
import { Role } from '@src/roles/domain/role';
import { RoleMapper } from '../mappers/role.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class RoleDocumentRepository implements RoleRepository {
  constructor(
    @InjectModel(RoleSchemaClass.name)
    private readonly roleModel: Model<RoleSchemaClass>,
  ) {}

  async create(data: Role): Promise<Role> {
    // console.log('repository data', data);
    const persistenceModel = RoleMapper.toPersistence(data);
    // console.log('toPersistence data', persistenceModel);
    const createdEntity = new this.roleModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return RoleMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[Role[], number]> {
    const entityObjects = await this.roleModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .populate('menuEntities')
      .exec();
    const total = await this.roleModel.countDocuments();
    return [
      entityObjects.map((entityObject) => RoleMapper.toDomain(entityObject)),
      total,
    ];
  }

  async findById(id: Role['id']): Promise<NullableType<Role>> {
    const entityObject = await this.roleModel.findById(id);
    return entityObject ? RoleMapper.toDomain(entityObject) : null;
  }

  async update(
    id: Role['id'],
    payload: Partial<Role>,
  ): Promise<NullableType<Role>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.roleModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.roleModel.findOneAndUpdate(
      filter,
      RoleMapper.toPersistence({
        ...RoleMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? RoleMapper.toDomain(entityObject) : null;
  }

  async remove(id: Role['id']): Promise<void> {
    await this.roleModel.deleteOne({ _id: id });
  }
}
