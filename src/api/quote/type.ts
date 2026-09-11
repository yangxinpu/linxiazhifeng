import type { Category } from '../global-type'

/** 名言筛选分类组合 */
export interface QuoteCategories {
  /** 主题分类（对应后端 quote.category 字段） */
  categories: Category[]
  /** 文体分类 */
  forms: Category[]
  /** 地域分类 */
  regions: Category[]
}

/** 名言文体分类 */
export type QuoteForm = 'proverb' | 'aphorism' | 'poetry' | 'literary' | 'folk'

/** 名言地域分类 */
export type QuoteRegion = 'china' | 'foreign'

/** 名言 */
export interface Quote {
  id: number
  content: string
  author: string
  source: string
  category: 'philosophy' | 'literature' | 'science' | 'life' | 'wisdom' | 'love' | 'friendship' | 'success' | 'courage' | 'education' | 'nature' | 'art' | 'history'
  form?: QuoteForm
  region?: QuoteRegion
  detailId: number
  background?: string
  viewCount: number
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
  createdAt: string
}

/** 名言详情 */
export interface QuoteDetail {
  id: number
  quoteId: number
  content: string
  author: string
  source: string
  category: 'philosophy' | 'literature' | 'science' | 'life' | 'wisdom' | 'love' | 'friendship' | 'success' | 'courage' | 'education' | 'nature' | 'art' | 'history'
  form?: QuoteForm
  region?: QuoteRegion
  authorBio: string
  story: string
  background: string
  viewCount: number
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
  createdAt: string
}

/** 名言互动类型。 */
export type QuoteEngagementType = 'like' | 'favorite'

/** 更新名言互动状态的请求参数。 */
export interface UpdateQuoteEngagementParams {
  type: QuoteEngagementType
  isActive: boolean
}

/** 名言最新互动状态。 */
export interface QuoteEngagement {
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
}
