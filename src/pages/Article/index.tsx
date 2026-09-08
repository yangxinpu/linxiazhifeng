import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Heart, 
  Loader2
} from 'lucide-react'
import { getArticleList } from '@/api'
import type { Article } from '@/api'
import { useAppStore } from '@/stores'
import { toast } from 'sonner'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export default function Article() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useAppStore()
  const [articles, setArticles] = useState<Article[]>([])
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
      if (res.code === 20000 && res.data) {
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
    async function fetchArticles() {
      showLoading()
      try {
        const res = await getArticleList({ 
          page: 1, 
          pageSize
        })
        if (res.code === 20000 && res.data) {
          setArticles(res.data.list)
          setTotal(res.data.total)
          setPage(1)
        }
      } catch (error) {
        console.error('获取文章列表失败:', error)
        toast.error('获取文章列表失败，请稍后重试')
      } finally {
        hideLoading()
      }
    }
    fetchArticles()
  }, [showLoading, hideLoading])

  const handleArticleClick = useCallback((articleId: number) => {
    navigate(`/article/${articleId}`)
  }, [navigate])

  return (
    <section className="bg-background min-h-screen relative">
      <div className="max-w-4xl mx-auto px-10 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">暂无文章</p>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-lg">
              <div className="space-y-0">
                {articles.map((article, index) => (
                  <article
                    key={article.id}
                    onClick={() => handleArticleClick(article.id)}
                    className="group cursor-pointer transition-all duration-200"
                  >
                    <div className="py-4 px-4">
                      <div className="flex gap-4 mb-3">
                        {article.cover && (
                          <div className="flex-shrink-0 w-32 h-24 md:w-40 md:h-28 rounded-md overflow-hidden">
                            <img
                              src={article.cover}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors text-left">
                            {article.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed text-left">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/70">{article.author}</span>
                          
                          <div className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{article.likeCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          {article.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-0.5 bg-muted/50 text-muted-foreground text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index < articles.length - 1 && (
                      <div className="border-b border-border/20 mx-4" />
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div ref={observerRef} className="py-8 flex justify-center">
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">加载中...</span>
                </div>
              )}
              {!hasMore && articles.length > 0 && (
                <p className="text-sm text-muted-foreground">已经到底啦~</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
