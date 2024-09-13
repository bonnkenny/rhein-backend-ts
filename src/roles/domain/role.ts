import { ApiProperty } from '@nestjs/swagger';
import { MenuSchemaClass } from '@src/menus/infrastructure/persistence/document/entities/menu.schema';
import { Menu } from '@src/menus/domain/menu';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export class Role {
  @ApiProperty({
    type: String,
  })
  id: string;

  name: string;
  @ApiProperty({
    type: Number,
    enum: Object.values(BaseRoleEnum),
  })
  type: number;
  @ApiProperty({
    type: String,
  })
  description?: string;
  @ApiProperty({
    type: [String],
  })
  menuIds?: string[];

  @ApiProperty({ type: [MenuSchemaClass] })
  menuEntities?: Menu[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
