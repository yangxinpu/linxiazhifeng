import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageOutlined as QuoteIcon,
  LoadingOutlined as Loader2,
  DownOutlined as ChevronDown,
  UpOutlined as ChevronUp,
} from '@ant-design/icons'

import { getCategories, getQuoteList } from '@/api'
import type { Quote as QuoteType, QuoteCategories } from '@/api'
import PageSkeleton from '@/components/page-skeleton'
import { toast } from 'sonner'
import { formatDate } from '@/utils'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import styles from './index.module.scss'

/** 名言列表页面 */
export default function Quote() {
  const navigate = useNavigate()

  // 筛选选项（来自接口）
  const [filterOptions, setFilterOptions] = useState<QuoteCategories>({
    categories: [],
    forms: [],
    regions: [],
  })
  // 筛选状态
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all'])
  const [selectedForms, setSelectedForms] = useState<string[]>(['all'])
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['all'])
  const [showMoreFilters, setShowMoreFilters] = useState(true)

  // 列表状态
  const [quotes, setQuotes] = useState<QuoteType[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isListRefreshing, setIsListRefreshing] = useState(false)

  const pageSize = 6
  const hasMore = quotes.length < total

  /** 请求分类选项 */
  useEffect(() => {
    let isActive = true
    void (async () => {
      try {
        const res = await getCategories()
        if (isActive && res.code === 0 && res.data) {
          setFilterOptions(res.data)
        }
      } catch (error) {
        console.error('请求分类选项失败:', error)
      }
    })()
    return () => {
      isActive = false
    }
  }, [])

  /** 切分筛选条件 → 后端请求参数。选中 'all' 或空数组视为不过滤该维度 */
  const buildListParams = useCallback(
    (p: number, size: number) => {
      const activeCategories = selectedCategories.filter((v) => v !== 'all')
      const activeForms = selectedForms.filter((v) => v !== 'all')
      const activeRegions = selectedRegions.filter((v) => v !== 'all')
      const params: {
        page: number
        pageSize: number
        category?: string[]
        form?: string[]
        region?: string[]
      } = { page: p, pageSize: size }
      if (activeCategories.length > 0) params.category = activeCategories
      if (activeForms.length > 0) params.form = activeForms
      if (activeRegions.length > 0) params.region = activeRegions
      return params
    },
    [selectedCategories, selectedForms, selectedRegions],
  )

  /** 切换某一行分类：与 'all' 互斥（选具体项时去掉 all；选 all 时清空其他） */
  const toggleSelection = useCallback(
    (list: string[], setList: (next: string[]) => void, value: string) => {
      if (value === 'all') {
        setList(['all'])
        return
      }
      if (list.includes(value)) {
        const next = list.filter((v) => v !== value)
        // 若取消后为空，则回退到 "全部"
        setList(next.length === 0 ? ['all'] : next)
      } else {
        setList(list.filter((v) => v !== 'all').concat(value))
      }
    },
    [],
  )

  /** 请求列表，返回是否成功 */
  const fetchList = useCallback(
    async (p: number, size: number): Promise<QuoteType[] | null> => {
      try {
        const res = await getQuoteList(buildListParams(p, size))
        if (res.code === 0 && res.data) {
          setTotal(res.data.total)
          return res.data.list
        }
      } catch (error) {
        console.error('请求名言列表失败:', error)
        toast.error('加载失败，请稍后重试')
      }
      return null
    },
    [buildListParams],
  )

  /** 初始加载 + 筛选变更后刷新（仅影响列表区，不展示页面骨架） */
  useEffect(() => {
    let isActive = true
    const firstRun = isPageLoading

    void (async () => {
      if (!firstRun) setIsListRefreshing(true)
      const list = await fetchList(1, pageSize)
      if (isActive && list) {
        setQuotes(list)
        setPage(1)
      }
      if (firstRun) {
        setIsPageLoading(false)
      } else {
        setIsListRefreshing(false)
      }
    })()

    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedForms, selectedRegions])

  /** 无限滚动加载更多 */
  const loadMoreQuotes = useCallback(async () => {
    const nextPage = page + 1
    const list = await fetchList(nextPage, pageSize)
    if (list) {
      setQuotes((prev) => [...prev, ...list])
      setPage(nextPage)
    }
  }, [page, fetchList])

  const { observerRef, isLoading: isLoadingMore } = useInfiniteScroll({
    onLoadMore: loadMoreQuotes,
    hasMore,
    threshold: 300,
  })

  /** 跳转到名言详情页 */
  const handleQuoteClick = useCallback((quoteId: number) => {
    navigate(`/quote/${quoteId}`)
  }, [navigate])

  /** 渲染名言卡片 */
  const renderQuoteItem = useCallback(
    (quote: QuoteType) => (
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
            <p className={styles.quoteCardText}>{quote.content}</p>

            {quote.background && <p className={styles.quoteCardBackground}>{quote.background}</p>}
          </div>

          <div className={styles.quoteCardMeta}>
            <span className={styles.quoteCardAuthor}>{quote.author}</span>
            <span className={styles.quoteCardDate}>{formatDate(quote.createdAt)}</span>
          </div>
        </div>
      </article>
    ),
    [handleQuoteClick],
  )

  if (isPageLoading) {
    return <PageSkeleton />
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 分类筛选区 */}
        <div className={styles.categoryBar}>
          <div className={styles.categoryRow}>
            <span className={styles.categoryRowLabel}>主题</span>
            <div className={styles.categoryRowChips}>
              {filterOptions.categories.map((option) => {
                const isActive = selectedCategories.includes(option.value)
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => toggleSelection(selectedCategories, setSelectedCategories, option.value)}
                    aria-pressed={isActive}
                    className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ''}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowMoreFilters((prev) => !prev)}
              aria-expanded={showMoreFilters}
              aria-label={showMoreFilters ? '收起更多分类' : '展开更多分类'}
              className={styles.categoryExpandBtn}
            >
              {showMoreFilters ? (
                <>
                  收起
                  <ChevronUp />
                </>
              ) : (
                <>
                  更多
                  <ChevronDown />
                </>
              )}
            </button>
          </div>

          <div className={`${styles.expandableRows} ${showMoreFilters ? styles.expandableRowsOpen : ''}`}>
            <div className={styles.categoryRow}>
              <span className={styles.categoryRowLabel}>文体</span>
              <div className={styles.categoryRowChips}>
                {filterOptions.forms.map((option) => {
                  const isActive = selectedForms.includes(option.value)
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => toggleSelection(selectedForms, setSelectedForms, option.value)}
                      aria-pressed={isActive}
                      className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ''}`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className={styles.categoryRow}>
              <span className={styles.categoryRowLabel}>地域</span>
              <div className={styles.categoryRowChips}>
                {filterOptions.regions.map((option) => {
                  const isActive = selectedRegions.includes(option.value)
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => toggleSelection(selectedRegions, setSelectedRegions, option.value)}
                      aria-pressed={isActive}
                      className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ''}`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 列表区：筛选刷新时显示局部 loading 遮罩 */}
        <div className={styles.listArea}>
          {isListRefreshing && <div className={styles.listRefreshingMask} aria-hidden="true" />}

          {quotes.length === 0 && !isListRefreshing ? (
            <div className={styles.empty}>
              <QuoteIcon className={styles.emptyIcon} />
              <p className={styles.emptyText}>没有符合条件的名言</p>
            </div>
          ) : (
            <>
              <div className={styles.quoteList}>
                {quotes.map((quote) => (
                  <div key={quote.id}>{renderQuoteItem(quote)}</div>
                ))}
              </div>

              <div ref={observerRef} className={styles.loadMore}>
                {isLoadingMore && (
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
      </div>
    </section>
  )
}
