import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class FindAllOrderUsersDto extends InfinityFindAllDto {
  @ApiPropertyOptional({
    type: String,
    description: '订单ID',
  })
  @IsMongoId()
  @IsOptional()
  orderId?: string;
  @ApiPropertyOptional({
    type: String,
    description: '用户ID',
  })
  @IsMongoId()
  @IsOptional()
  userId?: string;
}
