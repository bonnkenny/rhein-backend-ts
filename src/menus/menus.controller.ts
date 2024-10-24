import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Menu } from './domain/menu';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityApiResponse,
  InfinityApiResponseDto,
  // InfinityPaginationResponse,
} from '../utils/dto/infinity-base-response.dto';
import { infinityResponse } from '../utils/infinity-response';
import { BaseRoles } from '@src/utils/guards/base-roles.decorator';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { BaseRolesGuard } from '@src/utils/guards/base-roles.guard';

@ApiTags('Menus')
@ApiBearerAuth()
@BaseRoles(BaseRoleEnum.SUPER)
@UseGuards(AuthGuard('jwt'), BaseRolesGuard)
@Controller({
  path: 'menus',
  version: '1',
})
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiCreatedResponse({
    type: InfinityApiResponseDto<Menu>,
  })
  create(@Body() createMenuDto: CreateMenuDto) {
    return infinityResponse(this.menusService.create(createMenuDto));
  }

  @Get()
  @ApiOkResponse({
    type: InfinityApiResponse(Array<Menu>),
  })
  async findAll() {
    const items = await this.menusService.findAll();
    return infinityResponse(items);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Menu,
  })
  findOne(@Param('id') id: string) {
    return infinityResponse(this.menusService.findOne(id));
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Menu,
  })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return infinityResponse(this.menusService.update(id, updateMenuDto));
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
