import { Injectable, NotFoundException } from '@nestjs/common';
import { NullableType } from '@src/utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { RoleSchemaClass } from '../entities/role.schema';
import { RoleRepository } from '../../role.repository';
import { Role } from '@src/roles/domain/role';
import { RoleMapper } from '../mappers/role.mapper';
import { FilterRolesOptionDto } from '@src/roles/dto/filter-roles-option.dto';

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

  async findAllWithPagination(
    filterOptions: FilterRolesOptionDto,
  ): Promise<[Role[], number]> {
    const { page, limit } = filterOptions;
    const where: FilterQuery<Role> = {};
    if (!!filterOptions?.type) {
      where.type = filterOptions.type;
    }
    if (!!filterOptions?.status) {
      where.status = filterOptions.status;
    }
    if (!!filterOptions?.ids) {
      where.id = { $in: filterOptions.ids.map((v) => new Types.ObjectId(v)) };
    }
    if (!!filterOptions?.name) {
      where.name = { $regex: filterOptions.name, $options: 'i' };
    }
    if (!!filterOptions?.description) {
      where.description = { $regex: filterOptions.description, $options: 'i' };
    }

    const entityObjects = await this.roleModel
      .find(where)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('menus')
      .exec();
    const total = await this.roleModel.find(where).countDocuments();
    return [
      entityObjects.map((entityObject) => RoleMapper.toDomain(entityObject)),
      total,
    ];
  }

  async findById(id: Role['id']): Promise<NullableType<Role>> {
    const entityObject = await this.roleModel.findById(id).populate('menus');
    console.log('entityObject', entityObject);
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
      throw new NotFoundException('Record not found');
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
    await this.roleModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
  }

  async findAll(filterOptions: FilterRolesOptionDto): Promise<Role[]> {
    const where: FilterQuery<Role> = {};
    if (filterOptions?.ids) {
      where['id'] = { $in: filterOptions.ids };
    }
    if (filterOptions?.type) {
      where['type'] = { $in: filterOptions.type };
    }
    const entities = await this.roleModel.find(where).populate('menus');
    return entities.map(RoleMapper.toDomain);
  }
}
