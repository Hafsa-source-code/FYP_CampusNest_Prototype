import { createContext, useContext, useState } from 'react'
const SearchCtx = createContext({ query: '', setQuery: () => {} })
export function SearchProvider({ children }) {
  const [query, setQuery] = useState('')
  return <SearchCtx.Provider value={{ query, setQuery }}>{children}</SearchCtx.Provider>
}
export const useSearchQuery = () => useContext(SearchCtx)
