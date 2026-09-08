import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Quote as QuoteIcon, Calendar, ChevronRight, Loader2 } from 'lucide-react'
import { getQuoteList, getLatestQuotes, getCategories } from '@/api'
import type { Quote as QuoteType } from '@/api'
import type { Category } from '@/types/api'
import { useAppStore } from '@/stores'
import { toast } from 'sonner'
import { formatDate } from '@/utils'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { VirtualList } from '@/components/VirtualList'

/** 名言列表页面 */
export default function Quote() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useAppStore()
  const [latestQuote, setLatestQuote] = useState<QuoteType | null>(null)
  const [quotes, setQuotes] = useState<QuoteType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const pageSize = 6

  const hasMore = quotes.length < total

  /** 加载更多名言 */
  const loadMoreQuotes = useCallback(async () => {
    try {
      const res = await getQuoteList({ 
        page: page + 1, 
        pageSize, 
        category: category || undefined 
      })
      if (res.code === 20000 && res.data) {
        setQuotes(prev => [...prev, ...res.data.list])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('加载更多名言失败:', error)
      toast.error('加载失败，请稍后重试')
    }
  }, [page, pageSize, category])

  /** 无限滚动加载 */
  const { observerRef, isLoading } = useInfiniteScroll({
    onLoadMore: loadMoreQuotes,
    hasMore,
    threshold: 300,
  })

  /** 监听滚动，控制分类选项粘性定位 */
  useEffect(() => {
    function handleScroll() {
      if (categoryRef.current) {
        const rect = categoryRef.current.getBoundingClientRect()
        const headerHeight = 56
        const isFixed = rect.top <= headerHeight + 1
        setIsSticky(isFixed)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /** 获取分类选项 */
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories()
        if (res.code === 20000 && res.data) {
          setCategories(res.data)
        }
      } catch (error) {
        console.error('获取分类选项失败:', error)
        toast.error('获取分类选项失败')
      }
    }
    fetchCategories()
  }, [])

  /** 获取最新名言 */
  useEffect(() => {
    async function fetchLatestQuote() {
      try {
        const res = await getLatestQuotes({ limit: 1 })
        if (res.code === 20000 && res.data && res.data.length > 0) {
          setLatestQuote(res.data[0])
        }
      } catch (error) {
        console.error('获取最新名言失败:', error)
        toast.error('获取最新名言失败')
      }
    }
    fetchLatestQuote()
  }, [])

  /** 获取名言列表（分类改变时重新加载） */
  useEffect(() => {
    async function fetchQuotes() {
      showLoading()
      try {
        const res = await getQuoteList({ page: 1, pageSize, category: category || undefined })
        if (res.code === 20000 && res.data) {
          setQuotes(res.data.list)
          setTotal(res.data.total)
          setPage(1)
        }
      } catch (error) {
        console.error('获取名言列表失败:', error)
        toast.error('获取名言列表失败，请稍后重试')
      } finally {
        hideLoading()
      }
    }
    fetchQuotes()
  }, [category, showLoading, hideLoading])

  /** 切换分类时重置页码 */
  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory)
  }, [])

  /** 跳转到名言详情页 */
  const handleQuoteClick = useCallback((quoteId: number) => {
    navigate(`/quote/${quoteId}`)
  }, [navigate])

  /** 渲染名言卡片 */
  const renderQuoteItem = useCallback((quote: QuoteType) => (
    <article
      onClick={() => handleQuoteClick(quote.id)}
      className="group relative bg-card rounded-xl p-5 shadow-sm border border-border/50 cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-base font-serif font-medium leading-relaxed group-hover:text-primary transition-colors">
            {quote.content}
          </p>
          
          {quote.background && (
            <p className="mt-2 text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed text-left">
              {quote.background}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 flex flex-col items-end gap-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">{quote.author}</span>
          <span className="flex items-center gap-1 text-xs">
            <Calendar className="w-3 h-3" />
            {formatDate(quote.createdAt)}
          </span>
        </div>
        
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </article>
  ), [handleQuoteClick])

  return (
    <section className="bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {latestQuote && (
          <header
            className="mb-12 cursor-pointer group"
            onClick={() => handleQuoteClick(latestQuote.id)}
          >
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-relaxed group-hover:text-primary transition-colors animate-fade-in">
              {latestQuote.content}
            </h1>
            <p className="text-muted-foreground text-lg text-right">
              —— {latestQuote.author}《{latestQuote.source}》
            </p>
          </header>
        )}

        <div 
          ref={categoryRef}
          className="sticky top-14 z-40 -mx-6 px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border/30 transition-all duration-500"
        >
          <div className={`flex flex-wrap gap-2 transition-all duration-500 ${isSticky ? 'justify-end' : 'justify-center'}`}>
            {categories.map((option) => (
              <button
                key={option.value}
                onClick={() => handleCategoryChange(option.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  category === option.value
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="text-center py-20">
            <QuoteIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">暂无名言</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <VirtualList
                items={quotes}
                itemHeight={140}
                renderItem={renderQuoteItem}
                className="h-[calc(100vh-400px)]"
                overscan={5}
              />
            </div>

            <div ref={observerRef} className="py-8 flex justify-center">
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">加载中...</span>
                </div>
              )}
              {!hasMore && quotes.length > 0 && (
                <p className="text-sm text-muted-foreground">已经到底啦~</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
