/** 名言 */
export interface Quote {
  id: number
  content: string
  author: string
  source: string
  category: 'philosophy' | 'literature' | 'science' | 'life' | 'wisdom' | 'love' | 'friendship' | 'success' | 'courage' | 'education' | 'nature' | 'art' | 'history'
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
