/**
 * MTB Credit Card Application - Standard API Types
 * 
 * ALL API adapter functions MUST return data using this structure.
 * 
 * RULES:
 * - status === 200 → SUCCESS
 * - status !== 200 → ERROR
 * - UI MUST treat any non-200 status as failure
 * - UI MUST display the `message` directly on screen
 * - data MUST be undefined when status !== 200
 */

export interface ApiResponse<T = undefined> {
  status: number;
  message: string;
  data?: T;
}

/**
 * Helper type for successful responses
 */
export interface ApiSuccessResponse<T> extends ApiResponse<T> {
  status: 200;
  data: T;
}

/**
 * Helper type for error responses
 */
export interface ApiErrorResponse extends ApiResponse<undefined> {
  status: number; // Non-200
  data: undefined;
}

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}
