export interface SearchParams {
  query: string
  fields?: string[]
  index: string
  page?: number
  limit?: number
}

export interface SearchResult {
  _id: string
  _source: Record<string, any>
  _score: number
  highlight?: Record<string, string[]>
}

export interface SearchResponse {
  hits: {
    total: {
      value: number
      relation: string
    }
    hits: SearchResult[]
  }
  took: number
  timed_out: boolean
  aggregations?: Record<string, any>
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchResultItem {
  id: string
  title: string
  description?: string
  type: 'document' | 'user' | 'project' | 'other'
  url?: string
  metadata?: Record<string, any>
  score: number
}

export interface SearchFilters {
  type?: string[]
  dateRange?: {
    from?: string
    to?: string
  }
  tags?: string[]
}