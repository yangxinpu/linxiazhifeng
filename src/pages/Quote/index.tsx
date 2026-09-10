import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageOutlined as QuoteIcon, CalendarOutlined as Calendar, RightOutlined as ChevronRight, LoadingOutlined as Loader2 } from '@ant-design/icons'
import { getQuoteList, getLatestQuotes, getCategories } from '@/api'
import type { Quote as QuoteType } from '@/api'
import type { Category } from '@/api'
import { useAppLoading } from '@/hooks'
import { toast } from 'sonner'
import { formatDate } from '@/utils'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './index.module.scss'

/** 名言列表页面 */
export default function Quote() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useAppLoading()
  const [latestQuote, setLatestQuote] = useState<QuoteType | null>(null)
  const [quotes, setQuotes] = useState<QuoteType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
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
      if (res.code === 0 && res.data) {
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

  /** 获取分类选项 */
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories()
        if (res.code === 0 && res.data) {
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
        if (res.code === 0 && res.data && res.data.length > 0) {
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
        if (res.code === 0 && res.data) {
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
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleQuoteClick(quote.id)
        }
      }}
      role="link"
      tabIndex={0}
      className={styles.quoteCard}
    >
      <div className={styles.quoteCardRow}>
        <div className={styles.quoteCardContent}>
          <p className={styles.quoteCardText}>
            {quote.content}
          </p>
          
          {quote.background && (
            <p className={styles.quoteCardBackground}>
              {quote.background}
            </p>
          )}
        </div>
        
        <div className={styles.quoteCardMeta}>
          <span className={styles.quoteCardAuthor}>{quote.author}</span>
          <span className={styles.quoteCardDate}>
            <Calendar className={styles.quoteCardDateIcon} />
            {formatDate(quote.createdAt)}
          </span>
        </div>
        
        <div className={styles.quoteCardArrow}>
          <ChevronRight className={styles.quoteCardArrowInner} />
        </div>
      </div>
    </article>
  ), [handleQuoteClick])

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {latestQuote && (
          <header
            className={styles.hero}
            onClick={() => handleQuoteClick(latestQuote.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleQuoteClick(latestQuote.id)
              }
            }}
            role="link"
            tabIndex={0}
          >
            <h1 className={styles.heroTitle}>
              {latestQuote.content}
            </h1>
            <p className={styles.heroMeta}>
              —— {latestQuote.author}《{latestQuote.source}》
            </p>
          </header>
        )}

        <div className={styles.categoryBar}>
          <div className={styles.categoryBarInner}>
            {categories.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => handleCategoryChange(option.value)}
                aria-pressed={category === option.value}
                className={`${styles.categoryBtn} ${category === option.value ? styles.categoryBtnActive : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className={styles.empty}>
            <QuoteIcon className={styles.emptyIcon} />
            <p className={styles.emptyText}>暂无名言</p>
          </div>
        ) : (
          <>
            <div className={styles.quoteList}>
              {quotes.map((quote) => (
                <div key={quote.id}>{renderQuoteItem(quote)}</div>
              ))}
            </div>

            <div ref={observerRef} className={styles.loadMore}>
              {isLoading && (
                <div className={styles.loadMoreLoading}>
                  <Loader2 className={styles.loadingIcon} />
                  <span className={styles.loadingText}>加载中...</span>
                </div>
              )}
              {!hasMore && quotes.length > 0 && (
                <p className={styles.loadMoreEnd}>已经到底啦~</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
