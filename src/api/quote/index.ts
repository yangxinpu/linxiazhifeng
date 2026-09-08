export type * from './type'

import { get } from '../http-client'
import type { Quote, QuoteDetail } from './type'
import type { Category, PaginatedResponse, ApiResponse } from '@/types/api'

export const getCategories = async (): Promise<ApiResponse<Category[]>> => get<Category[]>('/quotes/categories')

export const getLatestQuotes = async (params?: { limit?: number }): Promise<ApiResponse<Quote[]>> => 
  get<Quote[]>('/quotes/latest', params as Record<string, unknown>)

export const getQuoteList = async (params?: { page?: number; pageSize?: number; category?: string }): Promise<ApiResponse<PaginatedResponse<Quote>>> => 
  get<PaginatedResponse<Quote>>('/quotes', params as Record<string, unknown>)

export const getQuoteById = async (id: number): Promise<ApiResponse<Quote>> => get<Quote>(`/quotes/${id}`)

export const getQuoteDetail = async (id: number): Promise<ApiResponse<QuoteDetail>> => get<QuoteDetail>(`/quotes/${id}/detail`)
