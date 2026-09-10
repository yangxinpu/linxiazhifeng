import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOutlined as BookOpen, HeartOutlined as Heart, LoadingOutlined as Loader2 } from '@ant-design/icons'
import { getArticleList } from '@/api'
import type { Article } from '@/api'
import PageSkeleton from '@/components/page-skeleton'
import { toast } from 'sonner'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import styles from './index.module.scss'

export default function Article() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const hasMore = articles.length < total

  const loadMoreArticles = useCallback(async () => {
    try {
      const res = await getArticleList({ 
        page: page + 1, 
        pageSize
      })
      if (res.code === 0 && res.data) {
        setArticles(prev => [...prev, ...res.data.list])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('加载更多文章失败:', error)
      toast.error('加载失败，请稍后重试')
    }
  }, [page, pageSize])

  const { observerRef, isLoading } = useInfiniteScroll({
    onLoadMore: loadMoreArticles,
    hasMore,
    threshold: 300,
  })

  useEffect(() => {
    let isActive = true

    async function fetchArticles() {
      try {
        const res = await getArticleList({ 
          page: 1, 
          pageSize
        })
        if (isActive && res.code === 0 && res.data) {
          setArticles(res.data.list)
          setTotal(res.data.total)
          setPage(1)
        }
      } catch (error) {
        if (isActive) {
          console.error('获取文章列表失败:', error)
          toast.error('获取文章列表失败，请稍后重试')
        }
      } finally {
        if (isActive) {
          setIsPageLoading(false)
        }
      }
    }

    void fetchArticles()
    return () => {
      isActive = false
    }
  }, [])

  const handleArticleClick = useCallback((articleId: number) => {
    navigate(`/article/${articleId}`)
  }, [navigate])

  if (isPageLoading) {
    return <PageSkeleton />
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {articles.length === 0 ? (
          <div className={styles.empty}>
            <BookOpen className={styles.emptyIcon} />
            <p className={styles.emptyText}>暂无文章</p>
          </div>
        ) : (
          <>
            <div className={styles.listCard}>
              <div>
                {articles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => handleArticleClick(article.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleArticleClick(article.id)
                      }
                    }}
                    role="link"
                    tabIndex={0}
                    className={styles.listItem}
                  >
                    <div className={styles.listItemInner}>
                      {article.cover && (
                        <div className={styles.listItemCover}>
                          <img
                            src={article.cover}
                            alt={article.title}
                            className={styles.listItemCoverImg}
                          />
                        </div>
                      )}
                      
                      <div className={styles.listItemContent}>
                        <h3 className={styles.listItemTitle}>
                          {article.title}
                        </h3>
                        
                        <p className={styles.listItemSummary}>
                          {article.summary}
                        </p>
                      </div>
                    </div>
                    
                    <div className={styles.listItemMeta}>
                      <div className={styles.listItemAuthor}>
                        {article.author}
                      </div>
                      
                      <div className={styles.listItemLike}>
                        <Heart className={styles.listItemLikeIcon} />
                        <span>{article.likeCount}</span>
                      </div>
                      
                      <div className={styles.listItemTags}>
                        {article.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={styles.listItemTag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div ref={observerRef} className={styles.loadMore}>
              {isLoading && (
                <div className={styles.loadMoreLoading}>
                  <Loader2 className={styles.loadingIcon} />
                  <span className={styles.loadingText}>加载中...</span>
                </div>
              )}
              {!hasMore && articles.length > 0 && (
                <p className={styles.loadMoreEnd}>已经到底啦~</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
