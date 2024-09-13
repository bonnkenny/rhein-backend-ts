// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  name?: string;

  @ApiProperty({
    type: String,
    enum: [BaseRoleEnum.ADMIN, BaseRoleEnum.SUPPLIER],
  })
  @IsOptional()
  @IsEnum([BaseRoleEnum.ADMIN, BaseRoleEnum.SUPPLIER])
  type?: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  description?: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  menuIds?: string[];
}
