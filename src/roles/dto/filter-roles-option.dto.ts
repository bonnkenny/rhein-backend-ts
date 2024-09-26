import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { UserStatusEnum } from '@src/utils/enums/user-status.enum';

export class FilterRolesOptionDto extends InfinityFindAllDto {
  @ApiProperty({ type: [String], description: '角色id数组' })
  @IsMongoId({ each: true })
  @IsArray()
  @IsOptional()
  ids: string[];

  @ApiProperty({ type: String, description: '角色名称' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: String, enum: Object.keys(BaseRoleEnum) })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({
    type: String,
    description: '角色状态',
    required: false,
    enum: Object.keys(UserStatusEnum),
  })
  @IsString()
  @IsOptional()
  status: string;
}
