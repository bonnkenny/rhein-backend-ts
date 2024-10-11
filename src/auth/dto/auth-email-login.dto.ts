import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@src/utils/transformers/lower-case.transformer';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'admin@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    enum: ['ADMIN', 'SUPPLIER'],
    example: BaseRoleEnum.ADMIN,
  })
  @IsEnum(['ADMIN', 'SUPPLIER'])
  @IsNotEmpty()
  baseRole: string;
}
