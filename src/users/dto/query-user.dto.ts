import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
// import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
// import { RoleDto } from '@src/roles/dto/role.dto';

export class FilterUserDto extends InfinityFindAllDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  id?: string;
  @ApiPropertyOptional({ type: String, description: '用户名' })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ type: String, enum: Object.keys(BaseRoleEnum) })
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
