import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Clock, 
  BookOpen,
  Star,
  Play,
  Lightbulb,
  Tag
} from 'lucide-react'
import { getSpeakingBookById } from '@/api'
import type { SpeakingBookDetail } from '@/api'
import { useAppStore } from '@/stores'
import { toast } from 'sonner'

const levelMap = {
  beginner: { label: '初级', color: 'bg-green-500' },
  intermediate: { label: '中级', color: 'bg-yellow-500' },
  advanced: { label: '高级', color: 'bg-red-500' },
}

const categoryMap = {
  daily: '日常口语',
  business: '商务英语',
  travel: '旅游英语',
  academic: '学术英语',
  social: '社交英语',
}

const difficultyMap = {
  easy: { label: '简单', color: 'text-green-600 bg-green-50' },
  medium: { label: '中等', color: 'text-yellow-600 bg-yellow-50' },
  hard: { label: '困难', color: 'text-red-600 bg-red-50' },
}

export default function AiSpeakingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useAppStore()
  const [book, setBook] = useState<SpeakingBookDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null)

  useEffect(() => {
    async function fetchBook(bookId: number) {
      setError(null)
      showLoading()
      try {
        const res = await getSpeakingBookById(bookId)
        if (res.code === 20000 && res.data) {
          setBook(res.data)
        } else {
          const errorMsg = '书本不存在'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } catch (error) {
        console.error('获取书本详情失败:', error)
        const errorMsg = '获取书本详情失败，请稍后重试'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        hideLoading()
      }
    }

    async function init() {
      if (id) {
        const bookId = Number(id)
        if (isNaN(bookId) || bookId <= 0) {
          const errorMsg = '无效的书本ID'
          setError(errorMsg)
          toast.error(errorMsg)
          hideLoading()
        } else {
          await fetchBook(bookId)
        }
      } else {
        const errorMsg = '缺少书本ID'
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
            onClick={() => navigate('/speaking')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            返回口语练习
          </button>
        </div>
      </section>
    )
  }

  if (!book) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">书本不存在</h1>
          <button
            onClick={() => navigate('/speaking')}
            className="text-primary hover:underline"
          >
            返回口语练习
          </button>
        </div>
      </section>
    )
  }

  const currentArticle = selectedArticle !== null ? book.articles[selectedArticle] : null

  return (
    <section className="min-h-screen bg-background">
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border/20">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <button
            onClick={() => navigate('/speaking')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border/40 overflow-hidden sticky top-32">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
                
                <div className="absolute top-3 right-3">
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${levelMap[book.level].color}`}>
                    {levelMap[book.level].label}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold mb-2">{book.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{book.description}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.articleCount} 篇文章</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{book.duration} 分钟</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm px-3 py-1 bg-muted rounded-md">
                    {categoryMap[book.category]}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/20 p-5">
                <h3 className="text-sm font-semibold mb-3">文章列表</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {book.articles.map((article, index) => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(index)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                        selectedArticle === index
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="line-clamp-1">{article.title}</span>
                        <span className="text-xs ml-2 flex-shrink-0">
                          {article.duration}分钟
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {currentArticle ? (
              <div className="bg-card rounded-xl border border-border/40 p-6 md:p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${difficultyMap[currentArticle.difficulty].color}`}>
                      {difficultyMap[currentArticle.difficulty].label}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{currentArticle.duration} 分钟</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">{currentArticle.title}</h2>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Play className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">练习内容</h3>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-6">
                    <p className="text-lg leading-relaxed text-foreground whitespace-pre-line">
                      {currentArticle.content}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">中文翻译</h3>
                  <div className="bg-muted/30 rounded-lg p-6">
                    <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                      {currentArticle.translation}
                    </p>
                  </div>
                </div>

                {currentArticle.keywords.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">关键词</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentArticle.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-md font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentArticle.tips.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">练习技巧</h3>
                    </div>
                    <div className="space-y-3">
                      {currentArticle.tips.map((tip, index) => (
                        <div
                          key={index}
                          className="flex gap-3 bg-muted/30 rounded-lg p-4"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {index + 1}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border/40 p-12 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">选择一篇文章开始练习</h3>
                <p className="text-muted-foreground">
                  从左侧文章列表中选择一篇文章，开始你的口语练习之旅
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
