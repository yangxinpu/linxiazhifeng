/** 文章 */
export interface Article {
  id: number
  title: string
  summary: string
  content: string
  author: string
  category: 'technology' | 'philosophy' | 'literature' | 'science' | 'life' | 'wisdom' | 'art' | 'history'
  cover?: string
  tags: string[]
  viewCount: number
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
  createdAt: string
  updatedAt: string
}

/** 文章互动类型。 */
export type ArticleEngagementType = 'like' | 'favorite'

/** 更新文章互动状态的请求参数。 */
export interface UpdateArticleEngagementParams {
  type: ArticleEngagementType
  isActive: boolean
}

/** 文章最新互动状态。 */
export interface ArticleEngagement {
  likeCount: number
  favoriteCount: number
  isLiked: boolean
  isFavorited: boolean
}

/** 文章详情 */
export interface ArticleDetail extends Article {
  relatedArticles: Article[]
}
