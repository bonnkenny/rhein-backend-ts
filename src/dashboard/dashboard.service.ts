import { DashboardRepository } from '@src/dashboard/infrastructure/dashboard.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DashboardRepository)
    private readonly repository: DashboardRepository,
  ) {}

  getOverView() {
    return this.repository.getDashboardData();
  }
}
