import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

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
    type: [Types.ObjectId],
  })
  menus?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
