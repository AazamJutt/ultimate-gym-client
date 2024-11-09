export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  details?: string;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalCount?: number;
};
