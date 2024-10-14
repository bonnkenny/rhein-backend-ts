import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FilterFileDto {
  @ApiPropertyOptional({ type: String, description: 'id' })
  @IsMongoId()
  @Transform(({ value }) => (!!value ? value : undefined))
  @IsOptional()
  readonly id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly mime?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly path?: string;
}
