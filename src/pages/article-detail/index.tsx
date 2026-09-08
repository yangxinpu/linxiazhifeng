import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Heart } from 'lucide-react'
import { getArticleById } from '@/api'
import type { Article } from '@/api'
import { formatDate } from '@/utils'
import { useAppStore } from '@/stores'
import { toast } from 'sonner'

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
        if (res.code === 20000 && res.data) {
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
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">{error}</h1>
          <button
            onClick={() => navigate('/articles')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            返回文章列表
          </button>
        </div>
      </section>
    )
  }

  if (!article) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
          <button
            onClick={() => navigate('/articles')}
            className="text-primary hover:underline"
          >
            返回文章列表
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-background">
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border/20">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-card rounded-xl shadow-sm border border-border/40 p-8 md:p-12">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{article.author}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.createdAt, { monthFormat: 'long' })}</span>
              </div>

              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{article.likeCount}</span>
              </div>
            </div>
          </header>

          {article.cover && (
            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-8">
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-8 pb-8 border-b border-border/20">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {article.summary}
            </p>
          </div>

          <div className="prose prose-neutral max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-line text-base">
              {article.content}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
