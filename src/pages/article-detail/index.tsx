import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftOutlined as ArrowLeft,
  CalendarOutlined as Calendar,
  EyeOutlined as Eye,
  HeartFilled,
  HeartOutlined as Heart,
  StarFilled,
  StarOutlined as Star,
  UserOutlined as User,
} from '@ant-design/icons'
import { getArticleById, updateArticleEngagement } from '@/api'
import type { Article, ArticleEngagementType } from '@/api'
import { useScrollDownVisibility } from '@/hooks'
import { formatDate } from '@/utils'
import PageSkeleton from '@/components/page-skeleton'
import { toast } from 'sonner'
import styles from './index.module.scss'

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [loadedRouteId, setLoadedRouteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updatingEngagement, setUpdatingEngagement] = useState<ArticleEngagementType | null>(null)
  const isBackTitleVisible = useScrollDownVisibility()
  const articleId = Number(id)
  const routeError = !id
    ? '缺少文章ID'
    : Number.isNaN(articleId) || articleId <= 0
      ? '无效的文章ID'
      : null
  const isPageLoading = routeError === null && loadedRouteId !== id

  useEffect(() => {
    if (routeError || !id) return

    let isActive = true
    const requestedRouteId = id

    async function fetchArticle() {
      try {
        const res = await getArticleById(articleId)
        if (isActive && res.code === 0 && res.data) {
          setArticle(res.data)
          setError(null)
        } else if (isActive) {
          const errorMsg = '文章不存在'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } catch (error) {
        if (isActive) {
          console.error('获取文章详情失败:', error)
          const errorMsg = '获取文章详情失败，请稍后重试'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } finally {
        if (isActive) {
          setLoadedRouteId(requestedRouteId)
        }
      }
    }

    void fetchArticle()
    return () => {
      isActive = false
    }
  }, [articleId, id, routeError])

  async function handleEngagement(type: ArticleEngagementType) {
    if (!article || updatingEngagement !== null) return

    const isActive = type === 'like' ? !article.isLiked : !article.isFavorited
    setUpdatingEngagement(type)

    try {
      const response = await updateArticleEngagement(article.id, { type, isActive })
      setArticle((currentArticle) => currentArticle
        ? { ...currentArticle, ...response.data }
        : currentArticle)
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
            type="button"
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
            type="button"
            onClick={() => navigate('/articles')}
            className={styles.backBtn}
            aria-label="返回文章列表"
          >
            <ArrowLeft className={styles.backIcon} />
            <span>返回列表</span>
          </button>
          <h2
            className={`${styles.backBarTitle} ${
              isBackTitleVisible ? styles.backBarTitleVisible : ''
            }`}
            title={article.title}
            aria-hidden="true"
          >
            {article.title}
          </h2>
          <div className={styles.backBarActions}>
            <span
              className={styles.viewMetric}
              aria-label={`浏览量 ${article.viewCount}`}
              title={`浏览量 ${article.viewCount}`}
            >
              <Eye />
              <span className={styles.actionCount}>{article.viewCount}</span>
            </span>
            <button
              type="button"
              className={`${styles.actionButton} ${
                article.isLiked ? styles.actionButtonActive : ''
              }`}
              onClick={() => void handleEngagement('like')}
              disabled={updatingEngagement !== null}
              aria-label={article.isLiked ? '取消点赞' : '点赞'}
              aria-pressed={article.isLiked}
              title={article.isLiked ? '取消点赞' : '点赞'}
            >
              {article.isLiked ? <HeartFilled /> : <Heart />}
              <span className={styles.actionCount}>{article.likeCount}</span>
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${
                article.isFavorited ? styles.actionButtonActive : ''
              }`}
              onClick={() => void handleEngagement('favorite')}
              disabled={updatingEngagement !== null}
              aria-label={article.isFavorited ? '取消收藏' : '收藏'}
              aria-pressed={article.isFavorited}
              title={article.isFavorited ? '取消收藏' : '收藏'}
            >
              {article.isFavorited ? <StarFilled /> : <Star />}
              <span className={styles.actionCount}>{article.favoriteCount}</span>
            </button>
          </div>
        </div>
      </div>

      <article className={styles.articleCard}>
        <header className={styles.articleHeader}>
          <div className={styles.articleHeaderInner}>
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
                  <User className={styles.metaIcon} />
                </div>
                <div className={styles.metaAuthorName}>{article.author}</div>
              </div>

              <div className={styles.metaItem}>
                <Calendar className={styles.metaIcon} />
                <span>{formatDate(article.createdAt, { monthFormat: 'long' })}</span>
              </div>

              <div className={styles.metaItem}>
                <Heart className={styles.metaIcon} />
                <span>{article.likeCount}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.articleBody}>
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
        </div>
      </article>
    </section>
  )
}
