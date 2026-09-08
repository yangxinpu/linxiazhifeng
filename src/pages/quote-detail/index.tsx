import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, BookOpen, User, Quote } from 'lucide-react'
import { getQuoteDetail, getCategories } from '@/api'
import type { QuoteDetail } from '@/api'
import type { Category } from '@/types/api'
import { formatDate } from '@/utils'
import { useAppStore } from '@/stores'
import { toast } from 'sonner'
import logo from '@/assets/images/logo.png'

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useAppStore()
  const [detail, setDetail] = useState<QuoteDetail | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories()
        if (res.code === 20000 && res.data) {
          setCategories(res.data)
        }
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchDetail(quoteId: number) {
      setError(null)
      showLoading()
      try {
        const res = await getQuoteDetail(quoteId)
        if (res.code === 20000 && res.data) {
          setDetail(res.data)
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

    async function init() {
      if (id) {
        const quoteId = Number(id)
        if (isNaN(quoteId) || quoteId <= 0) {
          const errorMsg = '无效的名言ID'
          setError(errorMsg)
          toast.error(errorMsg)
          hideLoading()
        } else {
          await fetchDetail(quoteId)
        }
      } else {
        const errorMsg = '缺少名言ID'
        setError(errorMsg)
        toast.error(errorMsg)
        hideLoading()
      }
    }

    init()
  }, [id, showLoading, hideLoading])

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue)
    return category?.label || categoryValue
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">{error}</h1>
          <button
            onClick={() => navigate('/quote')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            返回名言列表
          </button>
        </div>
      </section>
    )
  }

  if (!detail) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">名言不存在</h1>
          <button
            onClick={() => navigate('/quote')}
            className="text-primary hover:underline"
          >
            返回名言列表
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="sticky top-14 z-40 -mx-6 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/30 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/quote')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-sm text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">返回</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-lg font-serif font-bold text-primary">林下之风</span>
              <img src={logo} alt="GroveGrace Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg font-serif font-bold" style={{ color: '#39a2fe' }}>GroveGrace</span>
            </div>
          </div>
        </div>

        <article className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border/50">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Quote className="w-10 h-10 text-primary" />
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {getCategoryLabel(detail.category)}
              </span>
            </div>

            <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed text-foreground mb-6 text-center">
              "{detail.content}"
            </blockquote>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-foreground">{detail.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>《{detail.source}》</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(detail.createdAt, { monthFormat: 'long' })}</span>
              </div>
            </div>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                人物介绍
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg text-left">
                {detail.authorBio}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                背景介绍
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg text-left">
                {detail.background}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                故事详情
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg text-left">
                {detail.story}
              </p>
            </section>
          </div>
        </article>
      </div>
    </section>
  )
}
