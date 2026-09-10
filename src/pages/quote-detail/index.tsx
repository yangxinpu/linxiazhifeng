import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined as ArrowLeft, BookOutlined as BookOpen, UserOutlined as User, MessageOutlined as Quote } from '@ant-design/icons'
import { getQuoteDetail, getCategories } from '@/api'
import type { QuoteDetail } from '@/api'
import type { Category } from '@/api'
import { formatDate } from '@/utils'
import PageSkeleton from '@/components/page-skeleton'
import { toast } from 'sonner'
import logo from '@/assets/images/logo.png'
import styles from './index.module.scss'

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadedRouteId, setLoadedRouteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
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
        setCategories(res.data)
      }
    }).catch(() => {})

    return () => {
      isActive = false
    }
  }, [id, quoteId, routeError])

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

  const categoryLabel = categories.find(c => c.value === quote.category)?.label ?? quote.category

  return (
    <section className={styles.section}>
      <div className={styles.backBar}>
        <div className={styles.backBarInner}>
          <button
            type="button"
            onClick={() => navigate('/quotes')}
            className={styles.backBtn}
          >
            <ArrowLeft className={styles.backIcon} />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <article className={styles.cardBody}>
          <header>
            <div className={styles.tagRow}>
              <span className={styles.tag}>{categoryLabel}</span>
            </div>
          </header>

          <Quote className={styles.quoteIcon} aria-hidden="true" />

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
              <BookOpen className={styles.metaIcon} />
              <span>{formatDate(quote.createdAt)}</span>
            </div>
          </div>

          {quote.background && (
            <div className={styles.background}>
              {quote.background}
            </div>
          )}

          <div className={styles.brandSignature}>
            <img src={logo} alt="" className={styles.brandLogo} />
            <span className={styles.brandName}>GroveGrace</span>
          </div>
        </article>
      </div>
    </section>
  )
}
