import { useEffect, useRef, useState, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  /** 触发加载更多的回调 */
  onLoadMore: () => void | Promise<void>
  /** 是否还有更多数据 */
  hasMore: boolean
  /** 距离底部多少像素触发加载（默认 200） */
  threshold?: number
  /** 根元素（默认 viewport） */
  root?: Element | null
}

interface UseInfiniteScrollResult {
  /** 观察目标元素的 ref，绑定到列表底部触发元素上 */
  observerRef: React.RefObject<HTMLDivElement | null>
  /** 是否正在加载中 */
  isLoading: boolean
}

/**
 * 无限滚动 Hook
 * 基于 IntersectionObserver，当底部触发元素进入视口时自动调用 onLoadMore
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  threshold = 200,
  root = null,
}: UseInfiniteScrollOptions): UseInfiniteScrollResult {
  const observerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const onLoadMoreRef = useRef(onLoadMore)

  // 保持回调最新引用
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  const handleIntersect = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true)
        try {
          await onLoadMoreRef.current()
        } finally {
          setIsLoading(false)
        }
      }
    },
    [hasMore, isLoading]
  )

  useEffect(() => {
    const el = observerRef.current
    if (!el) return

    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0,
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersect, threshold, root])

  return { observerRef, isLoading }
}
