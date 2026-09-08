export type * from './type'

import { get } from '../http-client'
import type { SpeakingBook, SpeakingBookDetail, SpeakingArticle } from './type'
import type { PaginatedResponse, ApiResponse } from '@/types/api'

export const getSpeakingBooks = async (params?: { 
  page?: number
  pageSize?: number
  level?: string
  category?: string
}): Promise<ApiResponse<PaginatedResponse<SpeakingBook>>> => 
  get<PaginatedResponse<SpeakingBook>>('/speaking/books', params as Record<string, unknown>)

export const getSpeakingBookById = async (id: number): Promise<ApiResponse<SpeakingBookDetail>> => 
  get<SpeakingBookDetail>(`/speaking/books/${id}`)

export const getSpeakingArticleById = async (bookId: number, articleId: number): Promise<ApiResponse<SpeakingArticle>> => 
  get<SpeakingArticle>(`/speaking/books/${bookId}/articles/${articleId}`)
