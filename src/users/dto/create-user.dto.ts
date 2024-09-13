import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  // decorators here
  IsEmail,
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

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  lastName: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ type: Number, enum: Object.values(BaseRoleEnum) })
  @IsOptional()
  @Transform((v) => {
    return !!v?.value
      ? BaseRoleEnum[v.value.toString().toUpperCase()]
      : undefined;
  })
  baseRole?: number;

  @ApiPropertyOptional({ type: Number, enum: Object.values(UserStatusEnum) })
  @IsOptional()
  @Transform((v) => {
    return !!v?.value
      ? UserStatusEnum[v.value.toString().toUpperCase()]
      : undefined;
  })
  // @Type(() => StatusDto)
  status?: number;

  @ApiPropertyOptional({ type: () => [String] })
  @IsArray()
  @IsString({ each: true })
  roleIds?: string[];

  hash?: string | null;
}
