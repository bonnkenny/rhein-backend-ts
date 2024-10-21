import { DashboardRepository } from '@src/dashboard/infrastructure/dashboard.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DashboardOverview } from '@src/dashboard/domain/dashboard-overview';
import { OrderCheckStatusEnum } from '@src/utils/enums/order-type.enum';
import { round } from 'lodash';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DashboardRepository)
    private readonly repository: DashboardRepository,
  ) {}

  async getOverView() {
    const data = new DashboardOverview();
    data.delayedOrder = await this.repository.getDelayOrder();
    data.newOrder = 0;
    data.pendingOrder = await this.repository.getOrderTotalByStatus(
      OrderCheckStatusEnum.PENDING,
    );
    data.totalOrder = await this.repository.getOrderTotal();
    data.completedOrder = await this.repository.getOrderTotalByStatus(
      OrderCheckStatusEnum.APPROVED,
    );
    data.completeRate =
      data.totalOrder > 0
        ? round((data.completedOrder / data.totalOrder) * 100, 2)
        : 0;
    return Promise.resolve(data);
  }
}
