import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  // decorators here
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { FileDto } from '@src/files/dto/file.dto';
import { lowerCaseTransformer } from '@src/utils/transformers/lower-case.transformer';
import { UserStatusEnum } from '@src/utils/enums/user-status.enum';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty({
    example: 'secret1',
    type: String,
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  provider?: string;

  socialId?: string | null;

  // @ApiProperty({ example: 'John', type: String })
  // @IsNotEmpty()
  // firstName: string | null;
  //
  // @ApiProperty({ example: 'Doe', type: String })
  // @IsNotEmpty()
  // lastName: string | null;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsMongoId()
  @IsOptional()
  avatar?: FileDto | null;

  @ApiPropertyOptional({
    type: String,
    enum: [BaseRoleEnum.SUPPLIER, BaseRoleEnum.ADMIN],
  })
  @IsEnum([BaseRoleEnum.SUPPLIER, BaseRoleEnum.ADMIN], {
    message: 'Invalid base role',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return !value ? BaseRoleEnum.SUPPLIER : value;
  })
  baseRole: string;

  @ApiPropertyOptional({ type: String, enum: Object.values(UserStatusEnum) })
  @IsEnum(Object.values(UserStatusEnum), { message: 'Invalid status' })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ type: () => [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[];

  hash?: string | null;
}
