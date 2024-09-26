import { IPaginationOptions } from './types/pagination-options';
// import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto';
import {
  InfinityApiResponseDto,
  InfinityBaseResponseDto,
  InfinityPaginationResponseDto,
} from './dto/infinity-base-response.dto';
import { PaginationDataDto } from '@src/utils/dto/infinity-base-response.dto';

// export const infinityPagination = <T>(
//   data: T[],
//   options: IPaginationOptions,
// ): InfinityPaginationResponseDto<T> => {
//   return {
//     data,
//     hasNextPage: data.length === options.limit,
//   };
// };

export const infinityPagination = <T>(
  data: T[],
  total: number,
  options: IPaginationOptions,
  success?: boolean,
  message?: string,
): InfinityPaginationResponseDto<T> => {
  // console.log('options', options);
  const paginationData: PaginationDataDto<T> = {
    items: data,
    pageSize: options.limit,
    currentPage: options.page,
    total: total || 0,
  };

  return {
    data: paginationData,
    success: success || true,
    message: message || 'Ok',
  };
};

export const infinityResponse = <T>(
  data?: T,
  message?: string,
  success?: boolean,
): InfinityApiResponseDto<T> => {
  return !!data
    ? {
        data,
        success: success || true,
        message: message || 'Ok',
      }
    : {
        success: success || true,
        message: message || 'Ok',
      };
};

export const errorBody = (message: string): InfinityBaseResponseDto => {
  return {
    success: false,
    message: message,
  };
};
