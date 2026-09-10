import { http, HttpResponse, delay } from 'msw'
import { ARTICLE_CATEGORIES } from '@mocks/fakers/article.faker'
import { mockArticles } from '@mocks/data/content.data'

const BASE_URL = '/api'

export const articleHandlers = [
  http.get(`${BASE_URL}/articles/categories`, async () => {
    await delay(200)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: ARTICLE_CATEGORIES,
    })
  }),

  http.get(`${BASE_URL}/articles/latest`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit')) || 5

    const latestArticles = [...mockArticles]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: latestArticles,
    })
  }),

  http.get(`${BASE_URL}/articles`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const category = url.searchParams.get('category')
    const keyword = url.searchParams.get('keyword')

    let filtered = mockArticles

    if (category) {
      filtered = filtered.filter((a) => a.category === category)
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(lowerKeyword) ||
          a.summary.toLowerCase().includes(lowerKeyword) ||
          a.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
      )
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

  http.get(`${BASE_URL}/articles/:id`, async ({ params }) => {
    await delay(200)

    const id = Number(params.id)
    const article = mockArticles.find((a) => a.id === id)

    if (!article) {
      return HttpResponse.json(
        { code: 40400, message: '请求资源不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: article,
    })
  }),
]
