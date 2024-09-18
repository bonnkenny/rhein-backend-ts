import { ApiProperty } from '@nestjs/swagger';

export class Menu {
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
  })
  path: string;

  @ApiProperty({
    type: String,
  })
  parentId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class MenuTree extends Menu {
  @ApiProperty({
    type: () => [MenuTree],
    default: [],
  })
  children: MenuTree[];
}
