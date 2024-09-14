export interface IPaginationOptions {
  page: number;
  limit: number;
}

// export const defaultPaginationOptions = (query: {
//   page?: any;
//   limit?: any;
// }) => {
//   return {
//     page: query?.page ? Number(query.page) : 1,
//     limit: query?.limit ? Number(query.limit) : 10,
//   };
// };
