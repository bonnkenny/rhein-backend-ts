import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { Order } from './domain/order';
import { UsersService } from '../users/users.service';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { errorBody } from '@src/utils/infinity-response';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { OrderMaterialTemplatesService } from '@src/order-material-templates/order-material-templates.service';
import { OrderMaterialsService } from '@src/order-materials/order-materials.service';
import { OrderMaterial } from '@src/order-materials/domain/order-material';
import { FilterOrdersDto } from '@src/orders/dto/filter-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private usersService: UsersService,
    private orderMaterialTemplateService: OrderMaterialTemplatesService,
    @Inject(forwardRef(() => OrderMaterialsService))
    private orderMaterialService: OrderMaterialsService,
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

  async createWithMaterial(createOrderDto: CreateOrderDto) {
    const order = await this.create(createOrderDto);
    const orderType = order.orderType;
    const templates = await this.orderMaterialTemplateService.findAll({
      orderType,
    });
    const materials: OrderMaterial[] = [];
    if (templates.length) {
      for (const template of templates) {
        const material = await this.orderMaterialService.create({
          orderId: order.id,
          orderType: orderType,
          label: template.label,
          description: template.description,
          columns: template.columns,
          filledAt: null,
        });
        materials.push(material);
      }
    }
    return {
      ...order,
      materials,
    };
  }

  findAllWithPagination(filterOrderOptions: FilterOrdersDto) {
    return this.orderRepository.findAllWithPagination(filterOrderOptions);
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
