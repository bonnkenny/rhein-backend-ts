// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoseDto } from './create-rose.dto';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
// import { Menu } from '@src/menus/domain/menu';

export class UpdateRoseDto extends PartialType(CreateRoseDto) {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  name?: string;

  @ApiProperty({ type: String, enum: ['admin', 'supplier'], required: false })
  @IsOptional()
  @IsEnum(['admin', 'supplier'])
  type?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiProperty({ type: [String], required: false })
  menus?: string[];
}
