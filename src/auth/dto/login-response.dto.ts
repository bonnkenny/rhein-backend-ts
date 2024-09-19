import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/users/domain/user';

export class LoginResponseDto extends User {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expires: number;
}
