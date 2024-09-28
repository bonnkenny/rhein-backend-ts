import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { FilesService } from '../files/files.service';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { UserStatusEnum } from '@src/utils/enums/user-status.enum';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { JwtPayloadType } from '@src/auth/strategies/types/jwt-payload.type';
import { errorBody } from '@src/utils/infinity-response';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { SessionService } from '@src/session/session.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
    private sessionService: SessionService,
  ) {}

  async register(createProfileDto: CreateUserDto): Promise<User> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
    };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findByFilter({
        baseRole: BaseRoleEnum.SUPPLIER,
        email: clonedPayload.email ?? null,
      });
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }

    if (clonedPayload.avatar?.id) {
      const fileObject = await this.filesService.findById(
        clonedPayload.avatar.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      clonedPayload.avatar = fileObject;
    }

    clonedPayload.baseRole = BaseRoleEnum.SUPPLIER;

    clonedPayload.status = UserStatusEnum.ACTIVE;

    return this.usersRepository.create(clonedPayload);
  }

  async create(
    userJWTPayload: JwtPayloadType,
    createProfileDto: CreateUserDto,
  ): Promise<User> {
    // const currentUser = await this.usersRepository.findById(userJWTPayload?.id);
    // if (!currentUser) {
    //   throw new UnprocessableEntityException({
    //     status: HttpStatus.UNPROCESSABLE_ENTITY,
    //     errors: {
    //       user: 'Current user is invalidation',
    //     },
    //   });
    // }
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
    };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.avatar?.id) {
      const fileObject = await this.filesService.findById(
        clonedPayload.avatar.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException(errorBody('File not found'));
      }
      clonedPayload.avatar = fileObject;
    }
    if (userJWTPayload.baseRole === BaseRoleEnum.SUPPLIER) {
      clonedPayload.baseRole = BaseRoleEnum.SUPPLIER;
    } else {
      clonedPayload.baseRole = !!clonedPayload.baseRole
        ? clonedPayload.baseRole
        : BaseRoleEnum.ADMIN;
    }
    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findByFilter({
        baseRole: clonedPayload.baseRole,
        email: clonedPayload.email ?? null,
      });
      if (userObject) {
        throw new BadRequestException(errorBody('Email has been registered!'));
      }
    }

    clonedPayload.status = UserStatusEnum.ACTIVE;
    // console.log('cloned payload', clonedPayload);

    return this.usersRepository.create(clonedPayload);
  }

  findManyWithPagination(
    filterOptions: FilterUserDto,
  ): Promise<[User[], number]> {
    return this.usersRepository.findManyWithPagination(filterOptions);
  }

  findMany(
    filterOptions: Omit<FilterUserDto, 'page' | 'limit'>,
  ): Promise<User[]> {
    return this.usersRepository.findMany(filterOptions);
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  findByEmail({
    email,
    withROleMenu,
  }: {
    email: User['email'];
    withROleMenu?: boolean;
  }): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail({
      email,
      withRoleMenu: withROleMenu ?? false,
    });
  }

  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    return this.usersRepository.findBySocialIdAndProvider({
      socialId,
      provider,
    });
  }

  async update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null> {
    const clonedPayload = { ...payload };

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findByEmail({
        email: clonedPayload.email,
      });

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }

    if (clonedPayload.avatar?.id) {
      const fileObject = await this.filesService.findById(
        clonedPayload.avatar.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      clonedPayload.avatar = fileObject;
    }

    if (clonedPayload.baseRole) {
      const roleObject = Object.values(BaseRoleEnum)
        .map(String)
        .includes(String(clonedPayload.baseRole));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }
    }

    if (
      clonedPayload?.status &&
      clonedPayload?.status === UserStatusEnum.INACTIVE
    ) {
      await this.sessionService.deleteByUserId({ userId: id });
    }

    console.log('update body', clonedPayload);

    return this.usersRepository.update(id, clonedPayload);
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }

  async findByFilter(filter: Omit<FilterUserDto, 'page' | 'limit'>) {
    return this.usersRepository.findByFilter(filter);
  }
}
