import { IsEnum, IsString, IsArray, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { Menu } from '@src/menus/domain/menu';

export class CreateRoseDto {
  // Don't forget to use the class-validator decorators in the DTO properties.

  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(20)
  name: string;

  @ApiProperty({ type: String, enum: ['admin', 'supplier'] })
  @IsEnum(['admin', 'supplier'])
  type: string;

  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  menus?: string[];
}
