import { useCallback, useEffect, useState } from 'react'
import { getSearchResults } from '@/api'
import type { SearchResult } from '@/api'

const SEARCH_HISTORY_STORAGE_KEY = 'grovegrace-search-history'
const SEARCH_HISTORY_LIMIT = 8
const SEARCH_RESULT_LIMIT = 8
const SEARCH_DEBOUNCE_MS = 180

function readSearchHistory() {
  try {
    const storedValue: unknown = JSON.parse(
      localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY) ?? '[]',
    )

    if (!Array.isArray(storedValue)) return []

    return storedValue
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .slice(0, SEARCH_HISTORY_LIMIT)
  } catch {
    return []
  }
}

function persistSearchHistory(history: string[]) {
  localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(history))
}

/** 管理 Header 搜索请求和本地搜索历史。 */
export function useHeaderSearch(isEnabled: boolean) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [history, setHistory] = useState<string[]>(readSearchHistory)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEnabled) return

    const controller = new AbortController()
    const normalizedQuery = query.trim()
    const timer = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getSearchResults(
          {
            keyword: normalizedQuery || undefined,
            limit: SEARCH_RESULT_LIMIT,
          },
          controller.signal,
        )

        if (!controller.signal.aborted) {
          setResults(response.data)
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setResults([])
          setError(requestError instanceof Error ? requestError.message : '搜索失败')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, normalizedQuery ? SEARCH_DEBOUNCE_MS : 0)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [isEnabled, query])

  const commitSearch = useCallback((value: string) => {
    const normalizedValue = value.trim()
    if (!normalizedValue) return

    setHistory((currentHistory) => {
      const nextHistory = [
        normalizedValue,
        ...currentHistory.filter((item) => item !== normalizedValue),
      ].slice(0, SEARCH_HISTORY_LIMIT)

      persistSearchHistory(nextHistory)
      return nextHistory
    })
  }, [])

  const removeHistoryItem = useCallback((value: string) => {
    setHistory((currentHistory) => {
      const nextHistory = currentHistory.filter((item) => item !== value)
      persistSearchHistory(nextHistory)
      return nextHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY)
  }, [])

  const updateQuery = useCallback((value: string) => {
    setQuery(value)
    setIsLoading(isEnabled)
    setError(null)
  }, [isEnabled])

  const resetQuery = useCallback(() => {
    setQuery('')
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    query,
    setQuery: updateQuery,
    results,
    history,
    isLoading,
    error,
    commitSearch,
    removeHistoryItem,
    clearHistory,
    resetQuery,
  }
}
