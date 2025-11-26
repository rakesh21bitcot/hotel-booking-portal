export interface Pagination {
  page: number
  pageSize: number
  total?: number
}

export interface SortOrder {
  field: string
  direction: "asc" | "desc"
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface Destination {
  id: string
  name: string
  image: string
}