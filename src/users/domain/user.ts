import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { ApiProperty } from '@nestjs/swagger';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { UserStatusEnum } from '@src/utils/enums/user-status.enum';
import { Role } from '@src/roles/domain/role';
import { Menu } from '@src/menus/domain/menu';

const idType = String;

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @ApiProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: () => FileType,
  })
  photo?: FileType | null;

  @ApiProperty({
    type: Number,
    enum: Object.values(BaseRoleEnum),
  })
  baseRole?: number;

  @ApiProperty({
    type: Number,
    enum: Object.values(UserStatusEnum),
    description: 'Means:Active or Inactive, Values:1 or -1',
  })
  status?: number;
  @ApiProperty({ type: [String] })
  roleIds?: string[];

  @ApiProperty({ type: [Role] })
  roles?: Role[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  menus?: Menu[];
}
