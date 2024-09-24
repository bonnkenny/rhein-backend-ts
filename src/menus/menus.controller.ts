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
  InfinityApiResponseDto,
  InfinityPaginationResponse,
  // InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';
import {
  infinityPagination,
  infinityResponse,
} from '../utils/infinity-response';
import { FilterMenuOptionsDto } from './dto/filter-menu-options.dto';

@ApiTags('Menus')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
    type: InfinityPaginationResponse(Menu),
  })
  async findAll(
    @Query() query: FilterMenuOptionsDto,
  ): Promise<InfinityPaginationResponseDto<Menu>> {
    const [items, total] = await this.menusService.findAllWithPagination(query);
    return infinityPagination(items, total, query);
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
