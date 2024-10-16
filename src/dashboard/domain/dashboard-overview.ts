import { ApiProperty } from '@nestjs/swagger';

export class DashboardOverview {
  @ApiProperty({ type: Number, description: '订单总数' })
  totalOrder: number;
  @ApiProperty({ type: Number, description: '新订单数量' })
  newOrder: number;
  @ApiProperty({ type: Number, description: '已完成订单数量' })
  completedOrder: number;
  @ApiProperty({ type: Number, description: '进行中订单数量' })
  pendingOrder: number;
  @ApiProperty({ type: Number, description: '已延期订单数量' })
  delayedOrder: number;
  @ApiProperty({ type: Number, description: '供应商数量' })
  supplier: number;
  @ApiProperty({ type: Number, description: '订单完成率' })
  completeRate: number;
}
