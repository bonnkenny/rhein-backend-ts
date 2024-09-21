import { Injectable } from '@nestjs/common';
import { CreateOrderMaterialDto } from './dto/create-order-material.dto';
import { UpdateOrderMaterialDto } from './dto/update-order-material.dto';
import { OrderMaterialRepository } from './infrastructure/persistence/order-material.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { OrderMaterial } from './domain/order-material';
import { OrdersService } from '@src/orders/orders.service';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { errorBody } from '@src/utils/infinity-response';

@Injectable()
export class OrderMaterialsService {
  constructor(
    private readonly orderMaterialRepository: OrderMaterialRepository,
    private orderService: OrdersService,
  ) {}

  async create(createOrderMaterialDto: CreateOrderMaterialDto) {
    const { orderId } = createOrderMaterialDto;
    console.log('orderId', orderId);
    const order = await this.orderService.findOne(orderId);
    if (!order) {
      throw new BadRequestException(errorBody('Order not found'));
    }
    return this.orderMaterialRepository.create(createOrderMaterialDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.orderMaterialRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: OrderMaterial['id']) {
    return this.orderMaterialRepository.findById(id);
  }

  update(
    id: OrderMaterial['id'],
    updateOrderMaterialDto: UpdateOrderMaterialDto,
  ) {
    return this.orderMaterialRepository.update(id, updateOrderMaterialDto);
  }

  remove(id: OrderMaterial['id']) {
    return this.orderMaterialRepository.remove(id);
  }
}
