import { Inbox } from '@novu/react'
import { Search, Bell, X } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useIsAuthenticated, useLogout } from '@/features/auth/hooks/useAuth'
import { useDebouncedSearch } from '@/features/search/api/searchApi'
import { SearchDropdown } from '@/features/search/components/SearchDropdown'
import type { SearchResultItem } from '@/features/search/types'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const appId = import.meta.env.VITE_NOVU_APP_ID || 'YOUR_APP_ID'
  const subscriberId = import.meta.env.VITE_NOVU_SUBSCRIBER_ID || 'USER_ID'
  const { isAuthenticated } = useIsAuthenticated()
  const logoutMutation = useLogout()
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Search functionality
  const searchParams = {
    query: searchQuery,
    index: 'global', // Default index, could be made configurable
    limit: 10, // Limit for dropdown results
    page: 1
  }
  
  const { data: searchResults, isLoading } = useDebouncedSearch(
    searchParams,
    300, // 300ms debounce
    {
      enabled: isAuthenticated && searchQuery.length >= 2
    }
  )
  
  // Handle search result selection
  const handleSearchSelect = (item: SearchResultItem) => {
    console.log('Selected search result:', item)
    // Additional analytics or tracking could be added here
  }
  
  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Show dropdown when there's a query and search is focused
  const showSearchDropdown = isSearchOpen && searchQuery.length >= 0
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (!isSearchOpen) {
      setIsSearchOpen(true)
    }
  }
  
  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchOpen(true)
  }
  
  // Handle search clear
  const handleSearchClear = () => {
    setSearchQuery('')
    setIsSearchOpen(false)
  }
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false)
    }
  }

  return (
    <header className={cn('border-b sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <SidebarTrigger />
        {/* Brand */}
        <div className="font-semibold tracking-tight text-primary transition-transform duration-200 hover:scale-[1.01]">
          <Link to="/">SaaS Studio</Link>
        </div>

        {/* Search */}
        <div className="ml-auto flex w-full max-w-2xl items-center gap-2 md:ml-6">
          <div ref={searchRef} className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={isAuthenticated ? "Search..." : "Sign in to search"}
              className={cn("pl-9", searchQuery && "pr-9")}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onKeyDown={handleKeyDown}
              disabled={!isAuthenticated}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-7 w-7 p-0 -translate-y-1/2 hover:bg-muted"
                onClick={handleSearchClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {/* Search Results Dropdown */}
            {showSearchDropdown && (
              <SearchDropdown
                results={searchResults?.data?.hits?.hits || []}
                isLoading={isLoading}
                query={searchQuery}
                onSelect={handleSearchSelect}
                onClose={() => setIsSearchOpen(false)}
              />
            )}
          </div>

          {/* Novu Inbox as bell */}
          <div className="hidden sm:flex items-center">
            <Inbox
              applicationIdentifier={appId}
              subscriber={subscriberId}
              placement="right"
              placementOffset={10}
            >
              <Button variant="ghost" size="icon" className="relative hover:scale-105 transition-transform">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </Inbox>
          </div>

          {!isAuthenticated ? (
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
                {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
              </Button>
            </div>
          )}

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
