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
  likeCount: number
  createdAt: string
  updatedAt: string
}

/** 文章详情 */
export interface ArticleDetail extends Article {
  relatedArticles: Article[]
}
