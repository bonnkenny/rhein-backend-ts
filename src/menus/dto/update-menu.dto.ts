// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ type: String })
  @MaxLength(20)
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsOptional()
  path: string;
}
