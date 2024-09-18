import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FindAllRolesDto extends InfinityFindAllDto {
  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];
}
