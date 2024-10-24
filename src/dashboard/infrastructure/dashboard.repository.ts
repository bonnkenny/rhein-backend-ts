import { DashboardOverview } from '@src/dashboard/domain/dashboard-overview';
import { Injectable } from '@nestjs/common';
import { OrderSchemaClass } from '@src/orders/infrastructure/persistence/document/entities/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '@src/orders/domain/order';
import { OrderStatusEnum } from '@src/utils/enums/order-type.enum';
import { UserSchemaClass } from '@src/users/infrastructure/persistence/document/entities/user.schema';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import moment from 'moment';

@Injectable()
export class DashboardRepository {
  constructor(
    @InjectModel(OrderSchemaClass.name)
    private readonly orderModel: Model<OrderSchemaClass>,
    @InjectModel(UserSchemaClass.name)
    private readonly userModel: Model<UserSchemaClass>,
  ) {}
  getDashboardData(): Promise<DashboardOverview> {
    const data = new DashboardOverview();
    data.delayedOrder = 1;
    data.newOrder = 2;
    data.runningOrder = 3;
    data.totalOrder = 4;
    data.completedOrder = 5;
    data.completeRate = 6;
    return Promise.resolve(data);
  }

  async getOrderTotal(): Promise<number> {
    return this.orderModel.countDocuments();
  }
  async getOrderTotalByStatus(status: Order['checkStatus']): Promise<number> {
    return this.orderModel.countDocuments({ checkStatus: status });
  }

  async getRunningOrderTotal(): Promise<number> {
    return this.orderModel.countDocuments({
      checkStatus: {
        $in: [
          OrderStatusEnum.COLLECTING.toString(),
          OrderStatusEnum.REVIEWING.toString(),
          OrderStatusEnum.REPORTING.toString(),
        ],
      },
    });
  }

  async getSupplierCount(): Promise<number> {
    return this.userModel.countDocuments({
      baseRole: BaseRoleEnum.SUPPLIER.toString(),
    });
  }
  async getDelayOrder(): Promise<number> {
    const twoWeeksAgo = moment().subtract(14, 'days');
    return this.orderModel.countDocuments({
      status: { $ne: OrderStatusEnum.COMPLETED },
      createdAt: { $lt: twoWeeksAgo },
    });
  }
}
