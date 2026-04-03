/** API paylaşılan tipler (repo içi; dış workspace’teki @ensotek/core yerine). */

export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    page: number;
    limit?: number;
    per_page?: number;
    total: number;
    total_pages?: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type Locale = 'tr' | 'en';
