import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMenuDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  path: string;
}
