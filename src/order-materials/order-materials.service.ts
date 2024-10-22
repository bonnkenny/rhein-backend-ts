import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
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
import {
  OrderCheckStatusEnum,
  OrderStatusEnum,
} from '@src/utils/enums/order-type.enum';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { NewsRecordsService } from '@src/news-records/news-records.service';
import { NewsActionEnum } from '@src/utils/enums/news-action.enum';

@Injectable()
export class OrderMaterialsService {
  constructor(
    private readonly orderMaterialRepository: OrderMaterialRepository,
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
    @Inject(NewsRecordsService)
    private readonly newsRecordsService: NewsRecordsService,
  ) {}

  async create(createOrderMaterialDto: CreateOrderMaterialDto) {
    const { orderId } = createOrderMaterialDto;
    // console.log('orderId', orderId);
    const order = await this.orderService.findOne(orderId);
    if (!order) {
      throw new BadRequestException(errorBody('Order not found'));
    }
    return this.orderMaterialRepository.create({
      ...createOrderMaterialDto,
      agreement: false,
    });
  }

  findAllWithPagination(filterOptions: FindAllOrderMaterialsDto) {
    return this.orderMaterialRepository.findAllWithPagination(filterOptions);
  }

  findOne(id: OrderMaterial['id']) {
    return this.orderMaterialRepository.findById(id);
  }

  async update(
    id: OrderMaterial['id'],
    updateOrderMaterialDto: UpdateOrderMaterialDto,
  ) {
    const entity = await this.orderMaterialRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(errorBody('Data undefined'));
    }
    if (!updateOrderMaterialDto?.agreement) {
      throw new UnprocessableEntityException(
        errorBody('Please agree to the content authenticity guarantee first!'),
      );
    }
    const ret = this.orderMaterialRepository.update(id, updateOrderMaterialDto);
    await this.newsRecordsService.create({
      orderId: entity.orderId,
      materialId: id,
      materialLabel: entity.label,
      action: entity?.filledAt
        ? NewsActionEnum.MATERIAL_UPDATE
        : NewsActionEnum.MATERIAL_FILLED,
    });
    return ret;
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
    if (checkStatus === OrderCheckStatusEnum.REJECTED && !reason) {
      throw new BadRequestException(errorBody('Reason is required'));
    }

    const material = await this.orderMaterialRepository.findById(id);
    if (!material) {
      throw new NotFoundException(errorBody('Data undefined'));
    }

    const order = await this.orderService.findOne(material?.orderId);
    if (!order) {
      throw new NotFoundException(errorBody('Order not found'));
    }
    if (order.status === OrderStatusEnum.COMPLETED) {
      throw new BadRequestException(errorBody('Order has been completed'));
    }
    // const checkerId = checker.id;
    // if (checkerId !== material?.order?.fromUserId) {
    if (checker.baseRole === BaseRoleEnum.SUPPLIER || !checker.baseRole) {
      // if(checker.baseRole === BaseRoleEnum.ADMIN){
      //   // 检索管理员是否有订单权限
      //
      // }
      throw new ForbiddenException(
        errorBody('Has no permission for this order'),
      );
    }
    const entity = await this.orderMaterialRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(errorBody('Data undefined'));
    }
    const checkRet = this.orderMaterialRepository.updateCheckStatus(
      id,
      updateBody,
    );
    await this.newsRecordsService.create({
      orderId: entity.orderId,
      materialId: id,
      materialLabel: entity.label,
      action:
        updateBody.checkStatus === OrderCheckStatusEnum.APPROVED
          ? NewsActionEnum.MATERIAL_APPROVED
          : NewsActionEnum.MATERIAL_REJECTED,
    });

    return checkRet;
  }

  async setCustomOptional(
    ids: Array<OrderMaterial['id']>,
    checker: JwtPayloadType,
  ) {
    console.log(checker);
    return await this.orderMaterialRepository.setCustomOptional(ids);
  }
}
