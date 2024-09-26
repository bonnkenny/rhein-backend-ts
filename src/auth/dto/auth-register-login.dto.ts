import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@src/utils/transformers/lower-case.transformer';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret' })
  @MinLength(6)
  password: string;

  // @ApiProperty({ example: 'John' })
  // @IsNotEmpty()
  // firstName: string;
  //
  // @ApiProperty({ example: 'Doe' })
  // @IsNotEmpty()
  // lastName: string;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: BaseRoleEnum.SUPPLIER })
  @Transform(({ value }) => {
    return !value ? BaseRoleEnum.SUPPLIER : value;
  })
  baseRole?: string;
}
