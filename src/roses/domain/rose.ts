import { ApiProperty } from '@nestjs/swagger';
// import { Types } from 'mongoose';
import { MenuSchemaClass } from '@src/menus/infrastructure/persistence/document/entities/menu.schema';
import { Menu } from '@src/menus/domain/menu';

export class Rose {
  @ApiProperty({
    type: String,
  })
  id: string;
  @ApiProperty({
    type: String,
  })
  name: string;
  @ApiProperty({
    type: String,
    enum: ['admin', 'supplier', 'super'],
  })
  type?: string;
  @ApiProperty({
    type: String,
  })
  description?: string;
  @ApiProperty({
    type: [String],
  })
  menus?: string[];

  @ApiProperty({ type: [MenuSchemaClass] })
  menuEntities?: Menu[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
