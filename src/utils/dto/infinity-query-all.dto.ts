import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const defaultSize: number = 10;
const sizeSets = [defaultSize, 20, 50, 100];
const sizeChecker = ({ value }) => {
  return sizeSets.includes(Number(value)) ? Number(value) : 10;
};

export class InfinityFindAllDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @Transform(sizeChecker)
  @IsNumber()
  @IsOptional()
  limit: number;

  constructor() {
    this.page = this.page ?? 1;
    this.limit = this.limit ?? defaultSize;
  }
}

export class InfinitySortDto<T> {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof T;

  @ApiProperty()
  @IsString()
  order: string;

  constructor() {
    this.orderBy = this.orderBy ?? 'createdAt';
    this.order = this.order ?? -1;
  }
}
