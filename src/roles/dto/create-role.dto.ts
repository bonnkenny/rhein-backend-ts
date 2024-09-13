import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export class CreateRoleDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(20)
  name: string;

  @ApiProperty({
    type: Number,
    enum: [BaseRoleEnum.ADMIN, BaseRoleEnum.SUPPLIER],
    description: 'Base role type: Admin or Supplier,values:2 or 3',
  })
  @IsNumber()
  @IsEnum([BaseRoleEnum.ADMIN, BaseRoleEnum.SUPPLIER])
  type: number;

  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  menuIds?: string[];
}
