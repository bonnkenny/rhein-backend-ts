// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  path: string;
}
