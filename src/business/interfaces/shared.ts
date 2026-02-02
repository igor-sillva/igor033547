export interface PhotoDto {
  id: number
  nome: string
  contentType: string
  url: string
}

export interface PagedResponseDto<T> {
  page: number
  size: number
  total: number
  pageCount: number
  content: T[]
}

export interface PaginationQueryDto {
  page?: number
  size?: number
}
