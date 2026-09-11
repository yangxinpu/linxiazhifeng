import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftOutlined as ArrowLeft,
  EyeOutlined as Eye,
  HeartFilled,
  HeartOutlined as Heart,
  StarFilled,
  StarOutlined as Star,
  UserOutlined as User,
} from '@ant-design/icons'
import { getCategories, getQuoteDetail, updateQuoteEngagement } from '@/api'
import type { QuoteDetail, QuoteEngagementType } from '@/api'
import { useScrollDownVisibility } from '@/hooks'
import { formatDate } from '@/utils'
import PageSkeleton from '@/components/page-skeleton'
import { toast } from 'sonner'
import logo from '@/assets/images/Linxiazhifeng.png'
import styles from './index.module.scss'

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([])
  const [loadedRouteId, setLoadedRouteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updatingEngagement, setUpdatingEngagement] = useState<QuoteEngagementType | null>(null)
  const isBackTitleVisible = useScrollDownVisibility()
  const quoteId = Number(id)
  const routeError = !id
    ? '缺少名言ID'
    : Number.isNaN(quoteId) || quoteId <= 0
      ? '无效的名言ID'
      : null
  const isPageLoading = routeError === null && loadedRouteId !== id

  useEffect(() => {
    if (routeError || !id) return

    let isActive = true
    const requestedRouteId = id

    async function fetchDetail() {
      try {
        const res = await getQuoteDetail(quoteId)
        if (isActive && res.code === 0 && res.data) {
          setQuote(res.data)
          setError(null)
        } else if (isActive) {
          const errorMsg = '名言不存在'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } catch (error) {
        if (isActive) {
          console.error('获取名言详情失败:', error)
          const errorMsg = '获取名言详情失败，请稍后重试'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } finally {
        if (isActive) {
          setLoadedRouteId(requestedRouteId)
        }
      }
    }

    void fetchDetail()

    getCategories().then((res) => {
      if (isActive && res.code === 0 && res.data) {
        setCategoryOptions(res.data.categories)
      }
    }).catch(() => {})

    return () => {
      isActive = false
    }
  }, [id, quoteId, routeError])

  async function handleEngagement(type: QuoteEngagementType) {
    if (!quote || updatingEngagement !== null) return

    const isActive = type === 'like' ? !quote.isLiked : !quote.isFavorited
    setUpdatingEngagement(type)

    try {
      const response = await updateQuoteEngagement(quote.quoteId, { type, isActive })
      setQuote((currentQuote) => currentQuote
        ? { ...currentQuote, ...response.data }
        : currentQuote)
      toast.success(type === 'like'
        ? isActive ? '已点赞' : '已取消点赞'
        : isActive ? '已收藏' : '已取消收藏')
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : '操作失败，请稍后重试')
    } finally {
      setUpdatingEngagement(null)
    }
  }

  if (isPageLoading) {
    return <PageSkeleton variant="detail" />
  }

  if (routeError || error) {
    return (
      <section className={styles.errorPage}>
        <div>
          <h1 className={styles.errorPageTitle}>{routeError ?? error}</h1>
          <button
            type="button"
            onClick={() => navigate('/quotes')}
            className={styles.errorPageBtn}
          >
            返回名言列表
          </button>
        </div>
      </section>
    )
  }

  if (!quote) {
    return (
      <section className={styles.errorPage}>
        <div>
          <h1 className={styles.errorPageTitle}>名言不存在</h1>
          <button
            type="button"
            onClick={() => navigate('/quotes')}
            className={styles.errorPageBtn}
          >
            返回名言列表
          </button>
        </div>
      </section>
    )
  }

  const categoryLabel = categoryOptions.find(c => c.value === quote.category)?.label ?? quote.category

  return (
    <section className={styles.section}>
      <div className={styles.backBar}>
        <div className={styles.backBarInner}>
          <button
            type="button"
            onClick={() => navigate('/quotes')}
            className={styles.backBtn}
            aria-label="返回名言列表"
          >
            <ArrowLeft className={styles.backIcon} />
            <span>返回列表</span>
          </button>
          <h2
            className={`${styles.backBarTitle} ${
              isBackTitleVisible ? styles.backBarTitleVisible : ''
            }`}
            title={quote.content}
            aria-hidden="true"
          >
            {quote.content}
          </h2>
          <div className={styles.backBarActions}>
            <span
              className={styles.viewMetric}
              aria-label={`浏览量 ${quote.viewCount}`}
              title={`浏览量 ${quote.viewCount}`}
            >
              <Eye />
              <span className={styles.actionCount}>{quote.viewCount}</span>
            </span>
            <button
              type="button"
              className={`${styles.actionButton} ${
                quote.isLiked ? styles.actionButtonActive : ''
              }`}
              onClick={() => void handleEngagement('like')}
              disabled={updatingEngagement !== null}
              aria-label={quote.isLiked ? '取消点赞' : '点赞'}
              aria-pressed={quote.isLiked}
              title={quote.isLiked ? '取消点赞' : '点赞'}
            >
              {quote.isLiked ? <HeartFilled /> : <Heart />}
              <span className={styles.actionCount}>{quote.likeCount}</span>
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${
                quote.isFavorited ? styles.actionButtonActive : ''
              }`}
              onClick={() => void handleEngagement('favorite')}
              disabled={updatingEngagement !== null}
              aria-label={quote.isFavorited ? '取消收藏' : '收藏'}
              aria-pressed={quote.isFavorited}
              title={quote.isFavorited ? '取消收藏' : '收藏'}
            >
              {quote.isFavorited ? <StarFilled /> : <Star />}
              <span className={styles.actionCount}>{quote.favoriteCount}</span>
            </button>
          </div>
        </div>
      </div>

      <article className={styles.card}>
        <header className={styles.quoteHeader}>
          <div className={styles.quoteHeaderInner}>
            <div className={styles.tagRow}>
              <span className={styles.tag}>{categoryLabel}</span>
            </div>

            <h1 className={styles.quoteContent}>
              {quote.content}
            </h1>

            <div className={styles.divider} />

            <div className={styles.meta}>
              <div className={styles.metaAuthor}>
                <div className={styles.metaAvatar}>
                  <User className={styles.metaIcon} />
                </div>
                <div>
                  <div className={styles.metaAuthorName}>{quote.author}</div>
                  {quote.source && <div className={styles.metaSource}>{quote.source}</div>}
                </div>
              </div>

              <div className={styles.metaItem}>
                <span>{formatDate(quote.createdAt)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.cardBody}>
          {quote.background && (
            <div className={styles.background}>
              {quote.background}
            </div>
          )}

          <div className={styles.brandSignature}>
            <img src={logo} alt="" className={styles.brandLogo} />
            <span className={styles.brandName}>Linxiazhifeng</span>
          </div>
        </div>
      </article>
    </section>
  )
}
