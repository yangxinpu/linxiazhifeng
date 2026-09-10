import { http, HttpResponse, delay } from 'msw'
import { createMockQuoteDetail, CATEGORY_OPTIONS } from '@mocks/fakers'
import { mockQuotes } from '@mocks/data/content.data'

const BASE_URL = '/api'

export const quoteHandlers = [
  http.get(`${BASE_URL}/quotes/categories`, async () => {
    await delay(200)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: CATEGORY_OPTIONS,
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
    const category = url.searchParams.get('category')

    let filtered = mockQuotes
    if (category) {
      filtered = filtered.filter((q) => q.category === category)
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

    const detail = createMockQuoteDetail(quote)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: detail,
    })
  }),
]
