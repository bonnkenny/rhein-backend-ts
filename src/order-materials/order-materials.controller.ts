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
import { OrderMaterialsService } from './order-materials.service';
import { CreateOrderMaterialDto } from './dto/create-order-material.dto';
import { UpdateOrderMaterialDto } from './dto/update-order-material.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OrderMaterial } from './domain/order-material';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';
import { infinityPagination } from '../utils/infinity-response';
import { FindAllOrderMaterialsDto } from './dto/find-all-order-materials.dto';

@ApiTags('Ordermaterials')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'order-materials',
  version: '1',
})
export class OrderMaterialsController {
  constructor(private readonly orderMaterialsService: OrderMaterialsService) {}

  @Post()
  @ApiCreatedResponse({
    type: OrderMaterial,
  })
  create(@Body() createOrderMaterialDto: CreateOrderMaterialDto) {
    return this.orderMaterialsService.create(createOrderMaterialDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(OrderMaterial),
  })
  async findAll(
    @Query() query: FindAllOrderMaterialsDto,
  ): Promise<InfinityPaginationResponseDto<OrderMaterial>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const [items, total] =
      await this.orderMaterialsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      });
    return infinityPagination(items, total, { page, limit });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: OrderMaterial,
  })
  findOne(@Param('id') id: string) {
    return this.orderMaterialsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: OrderMaterial,
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderMaterialDto: UpdateOrderMaterialDto,
  ) {
    return this.orderMaterialsService.update(id, updateOrderMaterialDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.orderMaterialsService.remove(id);
  }
}
