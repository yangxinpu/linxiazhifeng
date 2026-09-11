import { http, HttpResponse, delay } from 'msw'
import type { SearchResult } from '@/api/search'
import { mockArticles, mockQuotes } from '@mocks/data/content.data'
import { CATEGORY_OPTIONS } from '@mocks/fakers/quote.faker'
import {
  contentThemeCategories,
  expressionStyleCategories,
  sourceAttributeCategories,
  timeRegionCategories,
  getCategoryLabel,
} from '@/constants/article-category'

const BASE_URL = '/api'
const DEFAULT_RESULT_LIMIT = 8
const MAX_RESULT_LIMIT = 20

interface SearchDocument {
  result: SearchResult
  fields: string[]
  popularity: number
}

const quoteCategoryLabels = new Map(CATEGORY_OPTIONS.map((item) => [item.value, item.label]))

const searchDocuments: SearchDocument[] = [
  ...mockQuotes.map((quote, index) => ({
    result: {
      id: quote.id,
      type: 'quote' as const,
      title: quote.content,
      excerpt: `《${quote.source}》`,
      author: quote.author,
    },
    fields: [
      quote.content,
      quote.author,
      quote.source,
      quoteCategoryLabels.get(quote.category) ?? quote.category,
    ],
    popularity: 600 - index * 4,
  })),
  ...mockArticles.map((article) => ({
    result: {
      id: article.id,
      type: 'article' as const,
      title: article.title,
      excerpt: article.summary,
      author: article.author,
    },
    fields: [
      article.title,
      article.summary,
      article.author,
      ...article.tags,
      getCategoryLabel(contentThemeCategories, article.contentTheme),
      getCategoryLabel(expressionStyleCategories, article.expressionStyle),
      getCategoryLabel(sourceAttributeCategories, article.sourceAttribute),
      getCategoryLabel(timeRegionCategories, article.timeRegion),
    ],
    popularity: article.likeCount,
  })),
]

function normalizeSearchText(value: string) {
  return value.toLocaleLowerCase('zh-CN').replace(/\s+/g, '')
}

/** 同时支持连续包含和字符顺序匹配，间距越短的结果排序越靠前。 */
function getFuzzyScore(value: string, keyword: string) {
  const normalizedValue = normalizeSearchText(value)
  const normalizedKeyword = normalizeSearchText(keyword)
  const directIndex = normalizedValue.indexOf(normalizedKeyword)

  if (directIndex >= 0) {
    return 1000 - directIndex * 8 - Math.max(0, normalizedValue.length - normalizedKeyword.length)
  }

  let previousIndex = -1
  let totalGap = 0

  for (const character of normalizedKeyword) {
    const nextIndex = normalizedValue.indexOf(character, previousIndex + 1)
    if (nextIndex < 0) return -1

    totalGap += previousIndex < 0 ? nextIndex : nextIndex - previousIndex - 1
    previousIndex = nextIndex
  }

  return 400 - totalGap * 6 - Math.max(0, normalizedValue.length - normalizedKeyword.length)
}

function getDocumentScore(document: SearchDocument, keyword: string) {
  return document.fields.reduce((bestScore, field, index) => {
    const fieldScore = getFuzzyScore(field, keyword)
    if (fieldScore < 0) return bestScore

    const weight = index === 0 ? 3 : index === 1 ? 1.5 : 1
    return Math.max(bestScore, fieldScore * weight)
  }, -1)
}

export const searchHandlers = [
  http.get(`${BASE_URL}/search`, async ({ request }) => {
    await delay(180)

    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')?.trim() ?? ''
    const requestedLimit = Number(url.searchParams.get('limit')) || DEFAULT_RESULT_LIMIT
    const limit = Math.min(Math.max(requestedLimit, 1), MAX_RESULT_LIMIT)

    const documents = keyword
      ? searchDocuments
        .map((document) => ({ document, score: getDocumentScore(document, keyword) }))
        .filter((item) => item.score >= 0)
        .sort((a, b) => b.score - a.score || b.document.popularity - a.document.popularity)
        .map((item) => item.document)
      : [...searchDocuments].sort((a, b) => b.popularity - a.popularity)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: documents.slice(0, limit).map((document) => document.result),
    })
  }),
]
