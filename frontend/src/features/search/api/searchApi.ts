import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { apiClient } from '@/lib/axios'
import type { SearchParams, SearchResponse, ApiResponse } from '../types'

// API service function
export const searchApi = {
  search: async (params: SearchParams): Promise<ApiResponse<SearchResponse>> => {
    const searchParams = new URLSearchParams()
    
    searchParams.append('query', params.query)
    searchParams.append('index', params.index)
    
    if (params.fields && params.fields.length > 0) {
      params.fields.forEach(field => searchParams.append('fields', field))
    }
    
    if (params.page) {
      searchParams.append('page', params.page.toString())
    }
    
    if (params.limit) {
      searchParams.append('limit', params.limit.toString())
    }
    
    const response = await apiClient.get(`/search?${searchParams.toString()}`)
    return response.data
  }
}

// Query keys factory
export const searchKeys = {
  all: ['search'] as const,
  search: (params: Partial<SearchParams>) => [...searchKeys.all, 'query', params] as const,
}

// React Query hooks
export const useSearch = (
  params: SearchParams,
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchOnWindowFocus?: boolean
  }
) => {
  return useQuery({
    queryKey: searchKeys.search(params),
    queryFn: () => searchApi.search(params),
    enabled: options?.enabled ?? (!!params.query && params.query.length >= 2), // Only search if query has 2+ characters
    staleTime: options?.staleTime ?? 30000, // 30 seconds
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: 2,
    retryDelay: 1000,
  })
}

// Hook for debounced search using @uidotdev/usehooks
export const useDebouncedSearch = (
  params: SearchParams,
  delay: number = 300,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) => {
  const debouncedQuery = useDebounce(params.query, delay)
  
  const debouncedParams = {
    ...params,
    query: debouncedQuery
  }

  return useSearch(debouncedParams, {
    ...options,
    enabled: options?.enabled ?? (!!debouncedQuery && debouncedQuery.length >= 2),
  })
}

