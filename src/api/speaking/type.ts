/** 口语练习书本 */
export interface SpeakingBook {
  id: number
  title: string
  description: string
  cover?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: 'daily' | 'business' | 'travel' | 'academic' | 'social'
  articleCount: number
  duration: number
  rating: number
  createdAt: string
}

/** 口语练习文章 */
export interface SpeakingArticle {
  id: number
  bookId: number
  title: string
  content: string
  translation: string
  audioUrl?: string
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  keywords: string[]
  tips: string[]
  order: number
  createdAt: string
}

/** 书本详情 */
export interface SpeakingBookDetail extends SpeakingBook {
  articles: SpeakingArticle[]
}
