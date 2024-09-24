import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateMenuDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => {
    const trimmedValue = value.trim();
    return trimmedValue.startsWith('/') ? trimmedValue : '/' + trimmedValue;
  })
  path: string;

  @ApiProperty({ type: Types.ObjectId })
  @IsNotEmpty()
  @IsMongoId({ message: 'parentId must be a valid ObjectId' })
  @IsOptional()
  parentId: string;
}
