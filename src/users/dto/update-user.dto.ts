import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { FileDto } from '@src/files/dto/file.dto';
// import { RoleDto } from '../../roles/dto/role.dto';
// import { StatusDto } from '@src/statuses/dto/status.dto';
import { lowerCaseTransformer } from '@src/utils/transformers/lower-case.transformer';
import { UserStatusEnum } from '@src/utils/enums/user-status.enum';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiPropertyOptional({ example: 'John', type: String })
  @IsOptional()
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe', type: String })
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ type: String, enum: Object.values(BaseRoleEnum) })
  @IsEnum(Object.keys(BaseRoleEnum), { message: 'Invalid base role' })
  @IsOptional()
  baseRole?: string;

  @ApiPropertyOptional({ type: Number, enum: Object.values(UserStatusEnum) })
  @IsEnum(Object.keys(UserStatusEnum), { message: 'Invalid status' })
  @IsOptional()
  status?: string;

  hash?: string | null;
}
