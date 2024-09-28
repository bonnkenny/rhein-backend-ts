import { Injectable } from '@nestjs/common';
import { CreateOrderUserDto } from './dto/create-order-user.dto';
import { UpdateorderUserDto } from './dto/update-order-user.dto';
import { orderUserRepository } from './infrastructure/persistence/order-user.repository';
import { orderUser } from './domain/order-user';
import { FindAllorderUsersDto } from './dto/find-all-order-users.dto';

@Injectable()
export class orderUsersService {
  constructor(private readonly orderUserRepository: orderUserRepository) {}

  create(createorderUserDto: CreateOrderUserDto) {
    const { orderId, userIds } = createorderUserDto;
    const items = userIds.map((userId) => ({ orderId, userId }));
    return items.map((item) => this.orderUserRepository.create(item));
  }

  findAllWithPagination(filterOptions: FindAllorderUsersDto) {
    return this.orderUserRepository.findAllWithPagination(filterOptions);
  }

  findOne(id: orderUser['id']) {
    return this.orderUserRepository.findById(id);
  }

  update(id: orderUser['id'], updateorderUserDto: UpdateorderUserDto) {
    return this.orderUserRepository.update(id, updateorderUserDto);
  }

  remove(id: orderUser['id']) {
    return this.orderUserRepository.remove(id);
  }
}
