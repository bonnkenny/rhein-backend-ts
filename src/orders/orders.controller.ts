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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from './domain/order';
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
} from '../utils/infinity-response';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { NullableType } from '@src/utils/types/nullable.type';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiCreatedResponse({
    type: InfinityApiResponse(Order),
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<InfinityApiResponseDto<Order>> {
    const order = await this.ordersService.createWithMaterial(createOrderDto);
    // console.log('order', order);
    return infinityResponse(order);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Order),
  })
  async findAll(
    @Query() query: FilterOrdersDto,
  ): Promise<InfinityPaginationResponseDto<Order>> {
    const { page, limit } = query;
    const [items, total] =
      await this.ordersService.findAllWithPagination(query);
    return infinityPagination(items, total, { page, limit });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityApiResponse(Order),
  })
  findOne(
    @Param('id') id: string,
  ): InfinityApiResponseDto<Promise<NullableType<Order>>> {
    return infinityResponse(this.ordersService.findOne(id));
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityApiResponse(Order),
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): InfinityApiResponseDto<Promise<Order | null>> {
    return infinityResponse(this.ordersService.update(id, updateOrderDto));
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
