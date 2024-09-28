import { Injectable } from '@nestjs/common';
import { CreateOrderUserDto } from './dto/create-order-user.dto';
import { UpdateOrderUserDto } from './dto/update-order-user.dto';
import { orderUserRepository } from './infrastructure/persistence/order-user.repository';
import { orderUser } from './domain/order-user';
import { FindAllOrderUsersDto } from './dto/find-all-order-users.dto';

@Injectable()
export class OrderUsersService {
  constructor(private readonly orderUserRepository: orderUserRepository) {}

  create(createOrderUserDto: CreateOrderUserDto) {
    const { orderId, userIds } = createOrderUserDto;
    const items = userIds.map((userId) => ({ orderId, userId }));
    return items.map((item) => this.orderUserRepository.create(item));
  }

  findAllWithPagination(filterOptions: FindAllOrderUsersDto) {
    return this.orderUserRepository.findAllWithPagination(filterOptions);
  }

  findAll(filterOptions: Omit<FindAllOrderUsersDto, 'page' | 'limit'>) {
    return this.orderUserRepository.findAll(filterOptions);
  }

  findOne(id: orderUser['id']) {
    return this.orderUserRepository.findById(id);
  }

  update(id: orderUser['id'], updateOrderUserDto: UpdateOrderUserDto) {
    return this.orderUserRepository.update(id, updateOrderUserDto);
  }

  remove(id: orderUser['id']) {
    return this.orderUserRepository.remove(id);
  }
}
