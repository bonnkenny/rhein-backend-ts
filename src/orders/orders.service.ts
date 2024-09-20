import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Order } from './domain/order';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  create(createOrderDto: CreateOrderDto) {
    return this.orderRepository.create(createOrderDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.orderRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Order['id']) {
    return this.orderRepository.findById(id);
  }

  update(id: Order['id'], updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.update(id, updateOrderDto);
  }

  remove(id: Order['id']) {
    return this.orderRepository.remove(id);
  }
}
