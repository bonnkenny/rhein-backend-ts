import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Order } from './domain/order';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, parentId } = createOrderDto;

    if (userId) {
      const userCheck = await this.usersService.findByFilter({
        id: userId,
        baseRole: 'SUPPLIER',
      });
      if (!userCheck) {
        throw new NotFoundException({
          message: 'Assigning user not found',
          success: false,
        });
      }
    }
    if (parentId) {
      const parentCheck = this.orderRepository.findById(parentId);
      if (!parentCheck) {
        throw new Error('Parent not fount!');
      }
    }

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
