import { http, HttpResponse, delay } from 'msw'
import type { UpdateQuoteEngagementParams } from '@/api/quote'
import { createMockQuoteDetail, CATEGORY_OPTIONS, FORM_OPTIONS, REGION_OPTIONS } from '@mocks/fakers'
import { mockQuotes } from '@mocks/data/content.data'

const BASE_URL = '/api'

export const quoteHandlers = [
  http.get(`${BASE_URL}/quotes/categories`, async () => {
    await delay(200)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: {
        categories: CATEGORY_OPTIONS,
        forms: FORM_OPTIONS,
        regions: REGION_OPTIONS,
      },
    })
  }),

  http.get(`${BASE_URL}/quotes/latest`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit')) || 5

    const latestQuotes = [...mockQuotes]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: latestQuotes,
    })
  }),

  http.get(`${BASE_URL}/quotes`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const forms = url.searchParams.getAll('form')
    const regions = url.searchParams.getAll('region')

    let filtered = mockQuotes
    const categories = url.searchParams.getAll('category')
    if (categories.length > 0 && !(categories.length === 1 && categories[0] === 'all')) {
      filtered = filtered.filter((q) => categories.includes(q.category))
    }
    if (forms.length > 0) {
      filtered = filtered.filter((q) => q.form && forms.includes(q.form))
    }
    if (regions.length > 0) {
      filtered = filtered.filter((q) => q.region && regions.includes(q.region))
    }

    const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedList = sorted.slice(start, end)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: {
        list: paginatedList,
        total: filtered.length,
        page,
        pageSize,
      },
    })
  }),

  http.get(`${BASE_URL}/quotes/:id`, async ({ params }) => {
    await delay(200)

    const id = Number(params.id)
    const quote = mockQuotes.find((q) => q.id === id)

    if (!quote) {
      return HttpResponse.json(
        { code: 40400, message: '请求资源不存在', data: null },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: quote,
    })
  }),

  http.get(`${BASE_URL}/quotes/:id/detail`, async ({ params }) => {
    await delay(300)

    const id = Number(params.id)
    const quote = mockQuotes.find((q) => q.id === id)

    if (!quote) {
      return HttpResponse.json(
        { code: 40400, message: '请求资源不存在', data: null },
        { status: 404 },
      )
    }

    quote.viewCount += 1
    const detail = createMockQuoteDetail(quote)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: detail,
    })
  }),

  http.patch(`${BASE_URL}/quotes/:id/engagement`, async ({ params, request }) => {
    await delay(220)

    const id = Number(params.id)
    const quote = mockQuotes.find((item) => item.id === id)

    if (!quote) {
      return HttpResponse.json(
        { code: 40400, message: '请求资源不存在', data: null },
        { status: 404 },
      )
    }

    const engagement = await request.json() as Partial<UpdateQuoteEngagementParams>
    const isValidType = engagement.type === 'like' || engagement.type === 'favorite'

    if (!isValidType || typeof engagement.isActive !== 'boolean') {
      return HttpResponse.json(
        { code: 40000, message: '互动参数无效', data: null },
        { status: 400 },
      )
    }

    if (engagement.type === 'like' && quote.isLiked !== engagement.isActive) {
      quote.isLiked = engagement.isActive
      quote.likeCount = Math.max(0, quote.likeCount + (engagement.isActive ? 1 : -1))
    }

    if (engagement.type === 'favorite' && quote.isFavorited !== engagement.isActive) {
      quote.isFavorited = engagement.isActive
      quote.favoriteCount = Math.max(
        0,
        quote.favoriteCount + (engagement.isActive ? 1 : -1),
      )
    }

    return HttpResponse.json({
      code: 0,
      message: engagement.isActive ? '操作成功' : '已取消',
      data: {
        likeCount: quote.likeCount,
        favoriteCount: quote.favoriteCount,
        isLiked: quote.isLiked,
        isFavorited: quote.isFavorited,
      },
    })
  }),
]
