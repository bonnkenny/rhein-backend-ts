import { ApiProperty } from '@nestjs/swagger';

export class orderUser {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  orderId: string;

  @ApiProperty({
    type: String,
  })
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
