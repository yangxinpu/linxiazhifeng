export type * from './type'

import { get } from '../http-client'
import type { ApiResponse } from '../global-type'
import type { SearchParams, SearchResult } from './type'

/** 获取模糊匹配结果；关键词为空时返回热门内容。 */
export function getSearchResults(
  params?: SearchParams,
  signal?: AbortSignal,
): Promise<ApiResponse<SearchResult[]>> {
  return get<SearchResult[]>(
    '/search',
    params as Record<string, unknown>,
    { signal },
  )
}
