import { useEffect, useState } from 'react'
import { getLatestArticles, getLatestQuotes } from '@/api'
import type { Article, Quote } from '@/api'

interface HomeContent {
  articles: Article[]
  quotes: Quote[]
  isLoading: boolean
  error: string | null
}

/** 加载首页需要的最新文章与名言，允许单个内容源独立降级。 */
export function useHomeContent(): HomeContent {
  const [articles, setArticles] = useState<Article[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function fetchHomeContent() {
      const [articleResult, quoteResult] = await Promise.allSettled([
        getLatestArticles({ limit: 3 }),
        getLatestQuotes({ limit: 4 }),
      ])

      if (!isActive) return

      if (articleResult.status === 'fulfilled') {
        setArticles(articleResult.value.data)
      }

      if (quoteResult.status === 'fulfilled') {
        setQuotes(quoteResult.value.data)
      }

      if (
        articleResult.status === 'rejected'
        || quoteResult.status === 'rejected'
      ) {
        setError('部分内容暂时未能加载，请稍后再试')
      }

      setIsLoading(false)
    }

    void fetchHomeContent()

    return () => {
      isActive = false
    }
  }, [])

  return {
    articles,
    quotes,
    isLoading,
    error,
  }
}
