/** 可搜索内容的业务类型。 */
export type SearchResultType = 'quote' | 'article'

/** Header 综合搜索结果。 */
export interface SearchResult {
  id: number
  type: SearchResultType
  title: string
  excerpt: string
  author: string
}

/** 综合搜索请求参数。 */
export interface SearchParams {
  keyword?: string
  limit?: number
}
