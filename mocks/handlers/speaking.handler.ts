import { http, HttpResponse, delay } from 'msw'
import { createMockSpeakingBooks, createMockSpeakingArticles } from '@mocks/fakers/speaking.faker'

const BASE_URL = '/api'

const speakingBooks = createMockSpeakingBooks()

export const speakingHandlers = [
  http.get(`${BASE_URL}/speaking/books`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 12
    const level = url.searchParams.get('level')
    const category = url.searchParams.get('category')

    let filtered = speakingBooks

    if (level) {
      filtered = filtered.filter((book) => book.level === level)
    }

    if (category) {
      filtered = filtered.filter((book) => book.category === category)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedList = filtered.slice(start, end)

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

  http.get(`${BASE_URL}/speaking/books/:id`, async ({ params }) => {
    await delay(200)

    const id = Number(params.id)
    const book = speakingBooks.find((b) => b.id === id)

    if (!book) {
      return HttpResponse.json(
        { code: 40400, message: '书本不存在', data: null },
        { status: 404 }
      )
    }

    const articles = createMockSpeakingArticles(id, book.articleCount)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: {
        ...book,
        articles,
      },
    })
  }),

  http.get(`${BASE_URL}/speaking/books/:bookId/articles/:articleId`, async ({ params }) => {
    await delay(200)

    const bookId = Number(params.bookId)
    const articleId = Number(params.articleId)

    const book = speakingBooks.find((b) => b.id === bookId)

    if (!book) {
      return HttpResponse.json(
        { code: 40400, message: '书本不存在', data: null },
        { status: 404 }
      )
    }

    const articles = createMockSpeakingArticles(bookId, book.articleCount)
    const article = articles.find((a) => a.id === articleId)

    if (!article) {
      return HttpResponse.json(
        { code: 40400, message: '文章不存在', data: null },
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
