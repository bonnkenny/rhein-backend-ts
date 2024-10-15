import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
// import { IPaginationOptions } from '@src/utils/types/pagination-options';

export class InfinityBaseResponseDto {
  success: boolean;
  message: string;
}

export class InfinityApiResponseDto<T> extends InfinityBaseResponseDto {
  data?: T;
}

export class PaginationDataDto<T> {
  @ApiProperty({ isArray: true })
  items: T[];
  total: number;
  pageSize: number;
  currentPage: number;
}

export class InfinityPaginationResponseDto<T> extends InfinityBaseResponseDto {
  data: PaginationDataDto<T>;
}

export function InfinityApiResponse<T>(classReference?: Type<T>) {
  abstract class ApiResponse {
    @ApiProperty({ type: Boolean, example: true })
    success: boolean;

    @ApiProperty({ type: String, example: 'Success' })
    message: string;

    @ApiProperty({ type: classReference })
    data!: T;
  }

  Object.defineProperty(ApiResponse, 'name', {
    writable: false,
    value: `Infinity${classReference?.name}ResponseDto`,
  });

  return ApiResponse;
}

// 动态生成分页数据 DTO
export function CreatePaginationDataDto<T>(classReference: Type<T>) {
  class PaginationDataDto {
    @ApiProperty({ isArray: true, type: () => classReference }) // 使用惰性解析器
    items: T[];

    @ApiProperty({ type: Number, example: 100 })
    total: number;

    @ApiProperty({ type: Number, example: 10 })
    pageSize: number;

    @ApiProperty({ type: Number, example: 1 })
    currentPage: number;
  }

  // 为动态生成的类设置名称
  Object.defineProperty(PaginationDataDto, 'name', {
    writable: false,
    value: `PaginationData${classReference.name}Dto`,
  });

  return PaginationDataDto;
}

// 使用泛型创建分页响应
export function InfinityPaginationResponse<T>(classReference: Type<T>) {
  const PaginationData = CreatePaginationDataDto(classReference); // 动态生成 PaginationDataDto

  abstract class PaginationResponse extends InfinityBaseResponseDto {
    @ApiProperty({ type: () => PaginationData }) // 使用动态生成的 PaginationData
    data: InstanceType<typeof PaginationData>;
  }

  Object.defineProperty(PaginationResponse, 'name', {
    writable: false,
    value: `InfinityPagination${classReference.name}ResponseDto`,
  });

  return PaginationResponse;
}
