import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined as ArrowLeft, BookOutlined as BookOpen, UserOutlined as User, MessageOutlined as Quote } from '@ant-design/icons'
import { getQuoteDetail, getCategories } from '@/api'
import type { QuoteDetail } from '@/api'
import type { Category } from '@/api'
import { formatDate } from '@/utils'
import { useAppStore } from '@/stores'
import { toast } from 'sonner'
import logo from '@/assets/images/logo.png'
import styles from './index.module.scss'

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useAppStore()
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDetail(quoteId: number) {
      setError(null)
      showLoading()
      try {
        const res = await getQuoteDetail(quoteId)
        if (res.code === 0 && res.data) {
          setQuote(res.data)
        } else {
          const errorMsg = '名言不存在'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } catch (error) {
        console.error('获取名言详情失败:', error)
        const errorMsg = '获取名言详情失败，请稍后重试'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        hideLoading()
      }
    }

    if (id) {
      const quoteId = Number(id)
      if (!isNaN(quoteId) && quoteId > 0) {
        fetchDetail(quoteId)
      }
    }

    getCategories().then((res) => {
      if (res.code === 0 && res.data) {
        setCategories(res.data)
      }
    }).catch(() => {})
  }, [id, showLoading, hideLoading])

  if (error) {
    return (
      <section className={styles.errorPage}>
        <div>
          <h1 className={styles.errorPageTitle}>{error}</h1>
          <button
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
            onClick={() => navigate('/quotes')}
            className={styles.backBtn}
          >
            <ArrowLeft style={{ fontSize: 16 }} />
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

          <Quote style={{ fontSize: 32, marginBottom: 24, opacity: 0.3 }} />

          <h1 className={styles.quoteContent}>
            {quote.content}
          </h1>

          <div className={styles.divider} />

          <div className={styles.meta}>
            <div className={styles.metaAuthor}>
              <div className={styles.metaAvatar}>
                <User style={{ fontSize: 16 }} />
              </div>
              <div>
                <div className={styles.metaAuthorName}>{quote.author}</div>
                {quote.source && <div style={{ fontSize: 12, opacity: 0.7 }}>{quote.source}</div>}
              </div>
            </div>

            <div className={styles.metaItem}>
              <BookOpen style={{ fontSize: 16 }} />
              <span>{formatDate(quote.createdAt)}</span>
            </div>
          </div>

          {quote.background && (
            <div className={styles.background}>
              {quote.background}
            </div>
          )}

          {logo && (
            <div style={{ marginTop: 32, paddingTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.6 }}>
              <img src={logo} alt="GroveGrace" style={{ width: 24, height: 24 }} />
              <span style={{ fontSize: 14 }}>GroveGrace</span>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
