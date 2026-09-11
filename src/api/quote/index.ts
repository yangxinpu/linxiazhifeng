export type * from './type'

import { get, patch } from '../http-client'
import type {
  Quote,
  QuoteCategories,
  QuoteDetail,
  QuoteEngagement,
  UpdateQuoteEngagementParams,
} from './type'
import type { PaginatedResponse, ApiResponse } from '../global-type'

export const getCategories = async (): Promise<ApiResponse<QuoteCategories>> =>
  get<QuoteCategories>('/quotes/categories')

export const getLatestQuotes = async (params?: { limit?: number }): Promise<ApiResponse<Quote[]>> => 
  get<Quote[]>('/quotes/latest', params as Record<string, unknown>)

export const getQuoteList = async (params?: {
  page?: number
  pageSize?: number
  category?: string | string[]
  form?: string[]
  region?: string[]
}): Promise<ApiResponse<PaginatedResponse<Quote>>> =>
  get<PaginatedResponse<Quote>>('/quotes', params as Record<string, unknown>)

export const getQuoteById = async (id: number): Promise<ApiResponse<Quote>> => get<Quote>(`/quotes/${id}`)

export const getQuoteDetail = async (id: number): Promise<ApiResponse<QuoteDetail>> => get<QuoteDetail>(`/quotes/${id}/detail`)

/** 更新名言的点赞或收藏状态。 */
export function updateQuoteEngagement(
  id: number,
  engagement: UpdateQuoteEngagementParams,
): Promise<ApiResponse<QuoteEngagement>> {
  return patch<QuoteEngagement>(`/quotes/${id}/engagement`, { ...engagement })
}
