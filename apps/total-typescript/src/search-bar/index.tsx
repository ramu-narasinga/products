import React from 'react'
import {Command} from 'cmdk'
import Balancer from 'react-wrap-balancer'
import {getIcon, getResourceSlug, useDebounce} from 'pages/search'
import {trpc} from 'trpc/trpc.client'
import {useRouter} from 'next/router'
import {SearchIcon} from '@heroicons/react/solid'
import {useSearchBar} from './use-search-bar'

const GlobalSearchBar = () => {
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 500)
  const {data: searchResults, status} = trpc.search.resultsForQuery.useQuery({
    query: debouncedQuery,
  })

  const {open, setOpen} = useSearchBar()

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])
  const router = useRouter()
  const [inputValue, setInputValue] = React.useState('')

  return (
    <Command.Dialog
      value={inputValue}
      onValueChange={setInputValue}
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}
      label="Global Search Menu"
    >
      <div className="relative flex items-center gap-2 pb-2">
        <SearchIcon className="absolute ml-2 h-5 w-5" />
        <Command.Input
          value={query}
          onValueChange={(e) => setQuery(e)}
          autoFocus
          placeholder="Search Total TypeScript..."
        />
      </div>
      <Command.List>
        {status === 'loading' && (
          <Command.Loading>
            <Command.Item value="loading" key="loading" className="w-full">
              Loading...
            </Command.Item>
          </Command.Loading>
        )}
        {status === 'success' && (
          <Command.Empty>No results found.</Command.Empty>
        )}
        {searchResults?.map((result: any) => {
          if (!result) return null
          const resourceSlug = getResourceSlug(result)
          return resourceSlug ? (
            <Command.Item
              value={resourceSlug}
              key={resourceSlug}
              onSelect={(value) => {
                router.push(value)
              }}
            >
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0" aria-hidden="true">
                  {getIcon(
                    result._type === 'module'
                      ? result.moduleType
                      : result._type,
                  )}
                </span>
                <Balancer>{result.title} </Balancer>
              </div>
              <div className="w-16 justify-self-end font-mono text-xs font-normal uppercase text-gray-400 sm:w-24">
                {result._type === 'module'
                  ? `${result.moduleType}`
                  : `${result._type}`}
              </div>
            </Command.Item>
          ) : null
        })}
      </Command.List>
    </Command.Dialog>
  )
}

export default GlobalSearchBar
