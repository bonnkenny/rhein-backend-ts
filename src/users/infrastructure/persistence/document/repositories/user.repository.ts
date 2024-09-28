import { Injectable } from '@nestjs/common';

import { NullableType } from '@src/utils/types/nullable.type';
import { FilterUserDto } from '@src/users/dto/query-user.dto';
import { User } from '@src/users/domain/user';
import { UserRepository } from '../../user.repository';
import { UserSchemaClass } from '../entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserMapper } from '../mappers/user.mapper';
import { isValidMongoId, toMongoId } from '@src/utils/functions';

@Injectable()
export class UsersDocumentRepository implements UserRepository {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly usersModel: Model<UserSchemaClass>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const createdUser = new this.usersModel(persistenceModel);
    // console.log('user persistenceModel', persistenceModel);
    const userObject = await createdUser.save();
    return UserMapper.toDomain(userObject);
  }

  async findManyWithPagination(
    filterOptions: FilterUserDto,
  ): Promise<[User[], number]> {
    const { page, limit } = filterOptions;
    // console.log('filterOptions', filterOptions);
    const where: FilterQuery<UserSchemaClass> = {};
    Object.keys(filterOptions)
      .filter((v) => v !== 'page' && v !== 'limit')
      .forEach((key) => {
        if (!!filterOptions[key]) {
          switch (key) {
            case 'id':
              if (isValidMongoId(filterOptions[key])) {
                where['_id'] = toMongoId(filterOptions[key]);
              }
              break;
            case 'email':
              where['email'] = new RegExp(filterOptions[key], 'i');
              break;
            case 'username':
              const userNameRegex = new RegExp(filterOptions[key], 'i'); // 不区分大小写的搜索
              where['$or'] = [
                { firstName: userNameRegex },
                { lastName: userNameRegex },
              ];
              break;
            default:
              where[key] = filterOptions[key];
          }
        }
      });

    // console.log('where', where);

    const count = await this.usersModel.countDocuments(where);
    const userObjects = await this.usersModel
      .find(where)
      // .sort(
      //   sortOptions?.reduce(
      //     (accumulator, sort) => ({
      //       ...accumulator,
      //       [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
      //         sort.order.toUpperCase() === 'ASC' ? 1 : -1,
      //     }),
      //     {},
      //   ),
      // )
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'roles',
        populate: {
          path: 'menus',
        },
      })
      .exec();
    // console.log('user entities', userObjects);
    return [
      userObjects.map((userObject) => UserMapper.toDomain(userObject)),
      count,
    ];
  }

  async findMany(
    filterOptions: Omit<FilterUserDto, 'page' | 'limit'>,
  ): Promise<User[]> {
    const where: FilterQuery<UserSchemaClass> = {};
    if (filterOptions) {
      Object.keys(filterOptions).forEach((key) => {
        if (!!filterOptions[key]) {
          switch (key) {
            case 'id':
              if (isValidMongoId(filterOptions[key])) {
                where['_id'] = toMongoId(filterOptions[key]);
              }
              break;
            case 'email':
              where['email'] = new RegExp(filterOptions[key], 'i');
              break;
            case 'username':
              const userNameRegex = new RegExp(filterOptions[key], 'i'); // 不区分大小写的搜索
              where['$or'] = [
                { firstName: userNameRegex },
                { lastName: userNameRegex },
              ];
              break;
            default:
              where[key] = filterOptions[key];
          }
        }
      });
    }
    const userObjects = await this.usersModel.find(where);
    return userObjects.map((userObject) => UserMapper.toDomain(userObject));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const userObject = await this.usersModel.findById(id);
    return userObject ? UserMapper.toDomain(userObject) : null;
  }

  async findByEmail({
    email,
    withRoleMenu,
  }: {
    email: User['email'];
    withRoleMenu?: boolean;
  }): Promise<NullableType<User>> {
    if (!email) return null;
    withRoleMenu = withRoleMenu ?? false;

    const userObject = await this.usersModel.findOne({ email });
    if (!userObject) return null;
    if (!withRoleMenu) {
      return UserMapper.toDomain(userObject);
    }
    const userWithMenus = await userObject.populate({
      path: 'roles',
      populate: {
        path: 'menus',
      },
    });
    return UserMapper.toDomain(userWithMenus);
  }

  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    if (!socialId || !provider) return null;

    const userObject = await this.usersModel.findOne({
      socialId,
      provider,
    });

    return userObject ? UserMapper.toDomain(userObject) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const user = await this.usersModel.findOne(filter);

    if (!user) {
      return null;
    }

    const userObject = await this.usersModel.findOneAndUpdate(
      filter,
      UserMapper.toPersistence({
        ...UserMapper.toDomain(user),
        ...clonedPayload,
      }),
      { new: true },
    );

    return userObject ? UserMapper.toDomain(userObject) : null;
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersModel.updateOne(
      {
        _id: id.toString(),
      },
      { $set: { deletedAt: new Date() } },
    );
  }

  async findByFilter(
    filter: Omit<FilterUserDto, 'page' | 'limit'>,
  ): Promise<NullableType<User>> {
    const { id, status, baseRole, username, email } = filter || {};
    const where: FilterQuery<UserSchemaClass> = {};
    if (!!id) {
      where['_id'] = id;
    }
    if (!!status) {
      where['status'] = status;
    }
    if (!!baseRole) {
      where['baseRole'] = baseRole;
    }
    if (!!email) {
      where['email'] = new RegExp(email, 'i');
    }
    if (!!username) {
      const regex = new RegExp(username, 'i'); // 不区分大小写的搜索
      where['$or'] = [{ firstName: regex }, { lastName: regex }];
    }
    if (!Object.keys(where)) {
      return null;
    }
    return this.usersModel.findOne(where) ?? null;
  }
}
