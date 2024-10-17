import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from '@src/dashboard/dashboard.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { infinityResponse } from '@src/utils/infinity-response';
import { InfinityApiResponse } from '@src/utils/dto/infinity-base-response.dto';
import { DashboardOverview } from '@src/dashboard/domain/dashboard-overview';
import { AuthGuard } from '@nestjs/passport';
import { BaseRolesGuard } from '@src/utils/guards/base-roles.guard';
import { BaseRoles } from '@src/utils/guards/base-roles.decorator';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth()
@BaseRoles(BaseRoleEnum.SUPER.toString(), BaseRoleEnum.ADMIN.toString())
@UseGuards(AuthGuard('jwt'), BaseRolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('overview')
  @ApiOkResponse({ type: InfinityApiResponse(DashboardOverview) })
  async getOverview() {
    const overview = await this.dashboardService.getOverView();
    return infinityResponse(overview);
  }
}
