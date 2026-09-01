/**
 * Shape returned by every backend endpoint. Keeping a single envelope makes
 * error handling and loading states consistent across the whole app.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiFieldError[];
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

/** Normalised error shape thrown by the api client for UI consumption. */
export class ApiError extends Error {
  status: number;
  errors?: ApiFieldError[];
  code?: string;

  constructor(message: string, status: number, errors?: ApiFieldError[], code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}
