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
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';
import {
  infinityPagination,
  // infinityResponse,
} from '../utils/infinity-response';
import { FindAllRolesDto } from './dto/find-all-roles.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Role,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    console.log('CreateRoleDto', CreateRoleDto);
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Role),
  })
  async findAll(
    @Query() query: FindAllRolesDto,
  ): Promise<InfinityPaginationResponseDto<Role>> {
    const { page, limit } = query || {};
    const [items, total] = await this.rolesService.findAllWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
    return infinityPagination(items, total, query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Role,
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Role,
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
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
