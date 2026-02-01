import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { 
  FileText, 
  User, 
  FolderOpen, 
  Search,
  Clock,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchResult, SearchResultItem } from '../types'

interface SearchDropdownProps {
  results: SearchResult[]
  isLoading: boolean
  query: string
  onSelect: (item: SearchResultItem) => void
  onClose: () => void
  className?: string
}

// Helper function to transform search results to display items
const transformSearchResult = (result: SearchResult): SearchResultItem => {
  const source = result._source
  
  // Determine type based on source data
  let type: SearchResultItem['type'] = 'other'
  let title = source.title || source.name || 'Untitled'
  let description = source.description || source.content?.substring(0, 150)
  let url = source.url || `/search-result/${result._id}`

  // Type detection logic based on source structure
  if (source.type) {
    type = source.type
  } else if (source.email || source.username) {
    type = 'user'
    title = source.name || source.username
    description = source.email || source.bio
    url = `/user/${result._id}`
  } else if (source.content || source.body) {
    type = 'document'
    description = source.content?.substring(0, 150) || source.body?.substring(0, 150)
    url = `/document/${result._id}`
  } else if (source.members || source.team) {
    type = 'project'
    url = `/project/${result._id}`
  }

  return {
    id: result._id,
    title,
    description,
    type,
    url,
    score: result._score,
    metadata: source
  }
}

// Icon mapping for different result types
const getResultIcon = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'user':
      return <User className="h-4 w-4" />
    case 'document':
      return <FileText className="h-4 w-4" />
    case 'project':
      return <FolderOpen className="h-4 w-4" />
    default:
      return <Search className="h-4 w-4" />
  }
}

// Format result type for display
const formatResultType = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'user':
      return 'User'
    case 'document':
      return 'Document'
    case 'project':
      return 'Project'
    default:
      return 'Result'
  }
}

export function SearchDropdown({
  results,
  isLoading,
  query,
  onSelect,
  onClose,
  className
}: SearchDropdownProps) {
  const navigate = useNavigate()
  
  const transformedResults = results.map(transformSearchResult)
  
  // Group results by type
  const groupedResults = transformedResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResultItem[]>)

  const handleSelect = (item: SearchResultItem) => {
    onSelect(item)
    if (item.url) {
      navigate({ to: item.url })
    }
    onClose()
  }

  if (!query || query.length < 2) {
    return (
      <div className={cn(
        "absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg z-50 overflow-hidden",
        className
      )}>
        <div className="p-4 text-sm text-muted-foreground text-center">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Start typing to search...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg z-50 overflow-hidden max-h-96",
      className
    )}>
      <Command className="bg-transparent">
        <CommandList className="max-h-80">
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          )}
          {!isLoading && results.length === 0 && (
            <CommandEmpty>
              <div className="py-6 text-center">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No results found for "{query}"
                </p>
              </div>
            </CommandEmpty>
          )}
          
          {Object.entries(groupedResults).map(([type, items]) => (
            <CommandGroup 
              key={type} 
              heading={formatResultType(type as SearchResultItem['type'])}
            >
              {items.slice(0, 5).map((item) => ( // Limit to 5 items per group
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                    {getResultIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        {Math.round(item.score * 100)}%
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          
          {results.length > 0 && (
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  navigate({ 
                    to: '/search',
                    search: { q: query }
                  })
                  onClose()
                }}
                className="text-primary cursor-pointer"
              >
                <Search className="h-4 w-4 mr-2" />
                View all results for "{query}"
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  )
}