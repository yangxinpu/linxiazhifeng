import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Clock, 
  Star,
  Loader2,
  Sparkles
} from 'lucide-react'
import { getSpeakingBooks } from '@/api'
import type { SpeakingBook } from '@/api'
import { useAppStore } from '@/stores'
import { toast } from 'sonner'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

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

export default function AiSpeaking() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useAppStore()
  const [books, setBooks] = useState<SpeakingBook[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 12

  const hasMore = books.length < total

  const loadMoreBooks = useCallback(async () => {
    try {
      const res = await getSpeakingBooks({ 
        page: page + 1, 
        pageSize
      })
      if (res.code === 20000 && res.data) {
        setBooks(prev => [...prev, ...res.data.list])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('加载更多书本失败:', error)
      toast.error('加载失败，请稍后重试')
    }
  }, [page, pageSize])

  const { observerRef, isLoading } = useInfiniteScroll({
    onLoadMore: loadMoreBooks,
    hasMore,
    threshold: 300,
  })

  useEffect(() => {
    async function fetchBooks() {
      showLoading()
      try {
        const res = await getSpeakingBooks({ 
          page: 1, 
          pageSize
        })
        if (res.code === 20000 && res.data) {
          setBooks(res.data.list)
          setTotal(res.data.total)
          setPage(1)
        }
      } catch (error) {
        console.error('获取书本列表失败:', error)
        toast.error('获取书本列表失败，请稍后重试')
      } finally {
        hideLoading()
      }
    }
    fetchBooks()
  }, [showLoading, hideLoading])

  const handleBookClick = useCallback((bookId: number) => {
    navigate(`/speaking/${bookId}`)
  }, [navigate])

  return (
    <section className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">AI 口语练习</h1>
          </div>
          <p className="text-muted-foreground ml-13">
            选择一本口语练习书，开始你的口语提升之旅
          </p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">暂无口语练习书</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book.id)}
                  className="group cursor-pointer bg-card rounded-xl border border-border/40 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{book.articleCount} 篇文章</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{book.duration} 分钟</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2.5 py-1 bg-muted rounded-md">
                        {categoryMap[book.category]}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">{book.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div ref={observerRef} className="py-8 flex justify-center">
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">加载中...</span>
                </div>
              )}
              {!hasMore && books.length > 0 && (
                <p className="text-sm text-muted-foreground">已经到底啦~</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
