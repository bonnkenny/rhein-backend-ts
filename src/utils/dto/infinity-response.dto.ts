import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
export class InfinityResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}

export function InfinityResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: classReference })
    data!: T;

    @ApiProperty({
      type: String,
      example: true,
    })
    message: string;
    @ApiProperty({
      type: Boolean,
    })
    success: boolean;
  }

  Object.defineProperty(Response, 'name', {
    writable: false,
    value: `Infinity${classReference.name}ResponseDto`,
  });

  return Pagination;
}
