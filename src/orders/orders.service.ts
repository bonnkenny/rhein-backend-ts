import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
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
import { UserStatusEnum } from '@src/utils/enums/user-status.enum';
import { JwtPayloadType } from '@src/auth/strategies/types/jwt-payload.type';
import { random } from 'lodash';
import { OrderUsersService } from '@src/order-users/order-users.service';
import {
  ManufacturerArray,
  MaterialTemplateTypeEnum,
  TraderArray,
} from '@src/utils/enums/order-type.enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private usersService: UsersService,
    private orderMaterialTemplateService: OrderMaterialTemplatesService,
    private orderUsersService: OrderUsersService,
    @Inject(forwardRef(() => OrderMaterialsService))
    private orderMaterialService: OrderMaterialsService,
  ) {}

  async create(user: JwtPayloadType, createOrderDto: CreateOrderDto) {
    const { userId, parentId } = createOrderDto;
    if (!userId) {
      throw new BadRequestException(errorBody('UserId is required!'));
    }

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
    return this.orderRepository.create({
      ...createOrderDto,
      userId: userId.toString(),
      fromUserId: user.id.toString(),
      proxySet: false,
    });
  }

  async createWithMaterial(
    user: JwtPayloadType,
    createOrderDto: CreateOrderDto,
  ): Promise<Order & { materials: OrderMaterial[] }> {
    // console.log('create order dto', createOrderDto);
    const { email } = createOrderDto;
    const orderUser = await this.usersService.findByFilter({
      email,
      baseRole: BaseRoleEnum.SUPPLIER,
    });
    let orderUserId: string | null | undefined = orderUser?.id.toString();
    if (!orderUser) {
      const { password } = createOrderDto;
      if (!password) {
        throw new BadRequestException(errorBody('Password is required!'));
      }
      const createOrderUser = await this.usersService.create(user, {
        email,
        baseRole: BaseRoleEnum.SUPPLIER,
        status: UserStatusEnum.ACTIVE,
        password: password,
        provider: 'email',
        username: 'Supplier' + random(1000, 9999).toString(),
      });
      orderUserId = createOrderUser?.id.toString();
    }
    const order = await this.create(user, {
      ...createOrderDto,
      userId: orderUserId,
    });
    let templateType: MaterialTemplateTypeEnum | undefined;
    switch (true) {
      case ManufacturerArray.includes(order.orderType):
        templateType = MaterialTemplateTypeEnum.MANUFACTURER;
        break;
      case TraderArray.includes(order.orderType):
        templateType = MaterialTemplateTypeEnum.TRADER;
        break;
      case order.orderType === MaterialTemplateTypeEnum.FOREST_OWNER.toString():
        templateType = MaterialTemplateTypeEnum.FOREST_OWNER;
        break;
      default:
        templateType = undefined;
    }
    if (!templateType) {
      throw new BadRequestException(errorBody('Material type not found'));
    }
    const templates = await this.orderMaterialTemplateService.findAll({
      templateType,
    });
    const materials: OrderMaterial[] = [];
    if (templates.length) {
      for (const template of templates) {
        // console.log('template >>> ', template);
        const material = await this.orderMaterialService.create({
          orderId: order.id.toString(),
          orderType: order.orderType,
          templateType: templateType,
          label: template.label,
          description: template.description,
          subDescription: template?.subDescription ?? null,
          columns: template.columns,
          filledAt: null,
          isOptional: template.isOptional,
          isMultiple: template.isMultiple,
        });
        materials.push(material);
      }
    }
    return {
      ...order,
      materials,
    };
  }

  async findAllWithPagination(
    user: JwtPayloadType,
    filterOrderOptions: FilterOrdersDto,
  ) {
    const { baseRole, id } = user;
    let options: FilterOrdersDto = {
      ...filterOrderOptions,
    };
    if (BaseRoleEnum.ADMIN == baseRole) {
      const assignedOrders = await this.orderUsersService.findAll({
        userId: id,
      });
      const assignedOrderIds = assignedOrders.map((order) => order.orderId);
      const proxyOrders = await this.orderRepository.findAll({
        proxySet: true,
        fromUserId: id,
      });
      const proxyOrderIds = proxyOrders.map((order) => order.id);
      options = {
        ...options,
        ids: [...assignedOrderIds, ...proxyOrderIds],
      };
    }

    if (BaseRoleEnum.SUPPLIER == baseRole) {
      options = {
        ...options,
        userId: id,
        fromUserId: id,
      };
    }

    return this.orderRepository.findAllWithPagination(options);
  }

  findOne(id: Order['id']) {
    return this.orderRepository.findById(id);
  }

  update(
    id: Order['id'],
    updateOrderDto: Pick<UpdateOrderDto, 'orderName' | 'orderNo'>,
  ) {
    return this.orderRepository.update(id, updateOrderDto);
  }

  remove(id: Order['id']) {
    return this.orderRepository.remove(id);
  }

  async updateProxySet(
    id: Order['id'],
    user: JwtPayloadType,
    updateOrderDto: Pick<UpdateOrderDto, 'proxySet'>,
  ) {
    const { proxySet } = updateOrderDto;
    if (true !== proxySet && false !== proxySet) {
      throw new BadRequestException(errorBody('ProxySet value is required!'));
    }
    const order = await this.orderRepository.findById(id);
    if (order?.userId !== user.id) {
      throw new ForbiddenException(
        errorBody('Has no permission for this order'),
      );
    }
    return this.orderRepository.update(id, { proxySet: proxySet });
  }
}
