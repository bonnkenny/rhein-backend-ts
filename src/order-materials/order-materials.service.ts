import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderMaterialDto } from './dto/create-order-material.dto';
import {
  UpdateOrderMaterialDto,
  UpdateOrderMaterialStatusDto,
} from './dto/update-order-material.dto';
import { OrderMaterialRepository } from './infrastructure/persistence/order-material.repository';
import { OrderMaterial } from './domain/order-material';
import { OrdersService } from '@src/orders/orders.service';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { errorBody } from '@src/utils/infinity-response';
import { FindAllOrderMaterialsDto } from '@src/order-materials/dto/find-all-order-materials.dto';
import { JwtPayloadType } from '@src/auth/strategies/types/jwt-payload.type';
import { OrderStatusEnum } from '@src/utils/enums/order-type.enum';

@Injectable()
export class OrderMaterialsService {
  constructor(
    private readonly orderMaterialRepository: OrderMaterialRepository,
    @Inject(forwardRef(() => OrdersService))
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

  findAllWithPagination(filterOptions: FindAllOrderMaterialsDto) {
    return this.orderMaterialRepository.findAllWithPagination(filterOptions);
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

  async check(
    id: OrderMaterial['id'],
    updateBody: UpdateOrderMaterialStatusDto,
    checker: JwtPayloadType,
  ) {
    const { checkStatus, reason } = updateBody;
    if (checkStatus === OrderStatusEnum.REJECTED && !reason) {
      throw new BadRequestException(errorBody('Reason is required'));
    }

    const material = await this.orderMaterialRepository.findById(id);
    if (!material) {
      throw new NotFoundException(errorBody('Data undefined'));
    }
    const checkerId = checker.id;
    if (checkerId !== material?.order?.fromUserId) {
      throw new ForbiddenException(
        errorBody('Has no permission for this order'),
      );
    }
    return this.orderMaterialRepository.updateCheckStatus(id, updateBody);
  }
}
