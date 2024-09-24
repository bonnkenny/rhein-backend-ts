import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { User } from '../domain/user';
import {
  InfinityFindAllDto,
  InfinitySortDto,
} from '@src/utils/dto/infinity-query-all.dto';
// import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
// import { RoleDto } from '@src/roles/dto/role.dto';

export class FilterUserDto extends InfinityFindAllDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  id?: string;
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  baseRole?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  lastName?: string;
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  status?: string;
}

export class SortUserDto extends InfinitySortDto<User> {}

export class QueryUserDto extends InfinityFindAllDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterUserDto)
  filters?: FilterUserDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sort?: SortUserDto[] | null;
}
