import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined as ArrowLeft, CalendarOutlined as Calendar, UserOutlined as User, HeartOutlined as Heart } from '@ant-design/icons'
import { getArticleById } from '@/api'
import type { Article } from '@/api'
import { formatDate } from '@/utils'
import { useAppStore } from '@/stores'
import { toast } from 'sonner'
import styles from './index.module.scss'

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useAppStore()
  const [article, setArticle] = useState<Article | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle(articleId: number) {
      setError(null)
      showLoading()
      try {
        const res = await getArticleById(articleId)
        if (res.code === 0 && res.data) {
          setArticle(res.data)
        } else {
          const errorMsg = '文章不存在'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } catch (error) {
        console.error('获取文章详情失败:', error)
        const errorMsg = '获取文章详情失败，请稍后重试'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        hideLoading()
      }
    }

    async function init() {
      if (id) {
        const articleId = Number(id)
        if (isNaN(articleId) || articleId <= 0) {
          const errorMsg = '无效的文章ID'
          setError(errorMsg)
          toast.error(errorMsg)
          hideLoading()
        } else {
          await fetchArticle(articleId)
        }
      } else {
        const errorMsg = '缺少文章ID'
        setError(errorMsg)
        toast.error(errorMsg)
        hideLoading()
      }
    }

    init()
  }, [id, showLoading, hideLoading])

  if (error) {
    return (
      <section className={styles.errorPage}>
        <div>
          <h1 className={styles.errorPageTitle}>{error}</h1>
          <button
            onClick={() => navigate('/articles')}
            className={styles.errorPageBtn}
          >
            返回文章列表
          </button>
        </div>
      </section>
    )
  }

  if (!article) {
    return (
      <section className={styles.errorPage}>
        <div>
          <h1 className={styles.errorPageTitle}>文章不存在</h1>
          <button
            onClick={() => navigate('/articles')}
            className={styles.errorPageBtn}
          >
            返回文章列表
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.backBar}>
        <div className={styles.backBarInner}>
          <button
            onClick={() => navigate('/articles')}
            className={styles.backBtn}
          >
            <ArrowLeft style={{ fontSize: 16 }} />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      <div className={styles.articleCard}>
        <article className={styles.articleBody}>
          <header>
            <div className={styles.tagRow}>
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className={styles.tag}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className={styles.title}>
              {article.title}
            </h1>

            <div className={styles.meta}>
              <div className={styles.metaAuthor}>
                <div className={styles.metaAvatar}>
                  <User style={{ fontSize: 16 }} />
                </div>
                <div className={styles.metaAuthorName}>{article.author}</div>
              </div>

              <div className={styles.metaItem}>
                <Calendar style={{ fontSize: 16 }} />
                <span>{formatDate(article.createdAt, { monthFormat: 'long' })}</span>
              </div>

              <div className={styles.metaItem}>
                <Heart style={{ fontSize: 16 }} />
                <span>{article.likeCount}</span>
              </div>
            </div>
          </header>

          {article.cover && (
            <div className={styles.cover}>
              <img
                src={article.cover}
                alt={article.title}
                className={styles.coverImg}
              />
            </div>
          )}

          <div className={styles.summary}>
            {article.summary}
          </div>

          <div className={styles.content}>
            {article.content}
          </div>
        </article>
      </div>
    </section>
  )
}
