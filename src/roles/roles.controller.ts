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
  NotFoundException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './domain/role';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityApiResponse,
  InfinityApiResponseDto,
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';
import {
  infinityPagination,
  infinityResponse,
  // infinityResponse,
} from '../utils/infinity-response';
import { FilterRolesOptionDto } from './dto/filter-roles-option.dto';
import { NullableType } from '@src/utils/types/nullable.type';
import { BaseRoles } from '@src/utils/guards/base-roles.decorator';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { BaseRolesGuard } from '@src/utils/guards/base-roles.guard';

@ApiTags('Roles')
@ApiBearerAuth()
@BaseRoles(BaseRoleEnum.SUPER.toString())
@UseGuards(AuthGuard('jwt'), BaseRolesGuard)
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiCreatedResponse({
    type: InfinityApiResponse(Role),
  })
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<InfinityApiResponseDto<Role>> {
    console.log('CreateRoleDto', CreateRoleDto);
    const created = await this.rolesService.create(createRoleDto);
    return infinityResponse(created);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Role),
  })
  async findAll(
    @Query() query: FilterRolesOptionDto,
  ): Promise<InfinityPaginationResponseDto<Role>> {
    const [items, total] = await this.rolesService.findAllWithPagination(query);
    return infinityPagination(items, total, query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityApiResponse(Role),
  })
  findOne(
    @Param('id') id: string,
  ): InfinityApiResponseDto<Promise<NullableType<Role>>> {
    const role = this.rolesService.findOne(id);
    if (!role) {
      throw new NotFoundException({
        message: 'Role not found',
      });
    }
    return infinityResponse(role);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityApiResponse(Role),
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return infinityResponse(this.rolesService.update(id, updateRoleDto));
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
