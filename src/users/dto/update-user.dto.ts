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
  @IsEmail()
  @IsOptional()
  email?: string | null;

  @ApiPropertyOptional()
  @MinLength(6)
  @IsOptional()
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

  @ApiPropertyOptional({
    type: String,
    enum: Object.values(BaseRoleEnum),
    required: false,
  })
  @IsEnum(Object.keys(BaseRoleEnum), { message: 'Invalid base role' })
  @IsOptional()
  baseRole?: string;

  @ApiPropertyOptional({
    type: String,
    enum: Object.values(UserStatusEnum),
    required: false,
  })
  @IsEnum(Object.keys(UserStatusEnum), { message: 'Invalid status' })
  @IsOptional()
  status?: string;

  hash?: string | null;
}
