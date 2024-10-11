import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
// import { Roles } from '../roles/roles.decorator';
// import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

// import {
//   InfinityPaginationResponse,
//   InfinityPaginationResponseDto,
// } from '../utils/dto/infinity-pagination-response.dto';
import {
  InfinityApiResponse,
  InfinityApiResponseDto,
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, FilterUserOrderDto } from './dto/query-user.dto';
import { User } from './domain/user';
import { UsersService } from './users.service';
// import { RolesGuard } from '../roles/roles.guard';
// import { infinityPagination } from '../utils/infinity-pagination';
import {
  errorBody,
  infinityPagination,
  infinityResponse,
} from '../utils/infinity-response';

import { GroupTypesEnum } from '@src/utils/enums/groups.enum';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { BaseRolesGuard } from '@src/utils/guards/base-roles.guard';
import { BaseRoles } from '@src/utils/guards/base-roles.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({
    type: InfinityApiResponse(User),
  })
  @SerializeOptions({
    groups: [GroupTypesEnum.ADMIN],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() request,
    @Body() createProfileDto: CreateUserDto,
  ): Promise<InfinityApiResponseDto<User>> {
    const user = await this.usersService.create(request.user, createProfileDto);
    return infinityResponse(user);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(User),
  })
  @SerializeOptions({
    groups: [GroupTypesEnum.ADMIN],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllWithPagination(
    @Query() query: FilterUserDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    console.log('user query', query);
    const [items, total] =
      await this.usersService.findManyWithPagination(query);
    return infinityPagination(items, total, query);
  }

  @ApiOkResponse({
    type: InfinityApiResponse(User),
  })
  @BaseRoles(BaseRoleEnum.SUPER)
  @UseGuards(BaseRolesGuard)
  @Get('all/items')
  @HttpCode(HttpStatus.OK)
  async findAdmins(
    @Request() request,
    @Query() filterOptions: Omit<FilterUserOrderDto, 'page' | 'limit'>,
  ): Promise<InfinityApiResponseDto<User[]>> {
    const items: User[] = await this.usersService.findAdmins({
      ...filterOptions,
      baseRole: BaseRoleEnum.ADMIN,
    });
    return infinityResponse(items);
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: [GroupTypesEnum.ADMIN],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }

  @Get('query/check-supplier')
  @ApiOkResponse({
    type: InfinityApiResponse(User),
  })
  async checkSupplier(@Query('email') email: string) {
    // console.log('email', email);

    if (!email) {
      throw new BadRequestException(errorBody('Email is required'));
    }
    const result = await this.usersService.findOneByFilter({
      email: email,
      baseRole: BaseRoleEnum.SUPPLIER,
    });
    console.log('result', result);
    // if (!result || result.baseRole !== BaseRoleEnum.SUPPLIER.toString()) {
    //   return infinityResponse({});
    // }
    return infinityResponse(result ?? {});
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: [GroupTypesEnum.ADMIN],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    console.log('updateProfileDto', updateProfileDto);
    return this.usersService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: User['id']): Promise<void> {
    return this.usersService.remove(id);
  }
}
