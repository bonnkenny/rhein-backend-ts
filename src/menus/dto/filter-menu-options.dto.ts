// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { IsNumber, IsOptional } from 'class-validator';
// import { Transform } from 'class-transformer';
import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class FilterMenuOptionsDto extends InfinityFindAllDto {
  @ApiPropertyOptional({ type: String, description: '菜单名称' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ type: String, description: '父级菜单id' })
  @IsMongoId()
  @IsOptional()
  parentId: string;

  @ApiPropertyOptional({ type: String, description: '菜单路径' })
  @IsString()
  @IsOptional()
  path: string;
}
