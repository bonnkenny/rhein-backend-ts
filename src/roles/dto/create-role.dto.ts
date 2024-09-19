import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { Types } from 'mongoose';

export class CreateRoleDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(20)
  name: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(BaseRoleEnum),
    description: 'Base role type: Admin or Supplier,values:2 or 3',
  })
  @IsString()
  @IsEnum(Object.keys(BaseRoleEnum))
  type: string;

  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiProperty({ type: [Types.ObjectId] })
  @IsArray()
  @IsMongoId({ each: true, message: 'Invalid menu id' })
  menuIds?: string[];
}
