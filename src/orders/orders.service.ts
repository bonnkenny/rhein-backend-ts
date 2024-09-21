import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Order } from './domain/order';
import { UsersService } from '../users/users.service';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { errorBody } from '@src/utils/infinity-response';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, parentId } = createOrderDto;

    const userCheck = await this.usersService.findByFilter({
      id: userId,
      baseRole: BaseRoleEnum.SUPPLIER,
    });
    if (!userCheck) {
      throw new BadRequestException(errorBody('Assigning user not found'));
    }
    if (parentId) {
      const parentCheck = this.orderRepository.findById(parentId);
      if (!parentCheck) {
        throw new BadRequestException(errorBody('Parent not fount!'));
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
