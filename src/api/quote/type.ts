/** 名言 */
export interface Quote {
  id: number
  content: string
  author: string
  source: string
  category: 'philosophy' | 'literature' | 'science' | 'life' | 'wisdom' | 'love' | 'friendship' | 'success' | 'courage' | 'education' | 'nature' | 'art' | 'history'
  detailId: number
  background?: string
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
  createdAt: string
}
