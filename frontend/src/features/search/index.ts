// Export types
export type {
  SearchParams,
  SearchResult,
  SearchResponse,
  SearchResultItem,
  ApiResponse,
  SearchFilters
} from './types'

// Export API functions and hooks
export {
  searchApi,
  searchKeys,
  useSearch,
  useDebouncedSearch
} from './api/searchApi'

// Export components
export { SearchDropdown } from './components/SearchDropdown'