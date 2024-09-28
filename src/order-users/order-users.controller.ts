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
import { OrderUsersService } from './order-users.service';
import { CreateOrderUserDto } from './dto/create-order-user.dto';
import { UpdateOrderUserDto } from './dto/update-order-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { orderUser } from './domain/order-user';
import { AuthGuard } from '@nestjs/passport';

import {
  InfinityApiResponse,
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-base-response.dto';

import {
  infinityPagination,
  infinityResponse,
} from '../utils/infinity-response';

import { FindAllOrderUsersDto } from './dto/find-all-order-users.dto';

@ApiTags('Orderusers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'order-users',
  version: '1',
})
export class OrderUsersController {
  constructor(private readonly orderUsersService: OrderUsersService) {}

  @Post()
  @ApiCreatedResponse({
    type: InfinityApiResponse(orderUser),
  })
  create(@Body() createOrderUserDto: CreateOrderUserDto) {
    const entity = this.orderUsersService.create(createOrderUserDto);
    return infinityResponse(entity);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(orderUser),
  })
  async findAll(
    @Query() query: FindAllOrderUsersDto,
  ): Promise<InfinityPaginationResponseDto<orderUser>> {
    const [items, total] =
      await this.orderUsersService.findAllWithPagination(query);
    return infinityPagination(items, total, query);
  }

  // @Get(':id')
  // @ApiParam({
  //   name: 'id',
  //   type: String,
  //   required: true,
  // })
  // @ApiOkResponse({
  //   type: orderUser,
  // })
  // findOne(@Param('id') id: string) {
  //   return this.orderUsersService.findOne(id);
  // }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityApiResponse(orderUser),
  })
  update(
    @Param('id') id: string,
    @Body() updateorderUserDto: UpdateOrderUserDto,
  ) {
    const entity = this.orderUsersService.update(id, updateorderUserDto);
    return infinityResponse(entity);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.orderUsersService.remove(id);
  }
}
