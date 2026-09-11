import { http, HttpResponse, delay } from 'msw'
import type { UpdateArticleEngagementParams } from '@/api/article'
import {
  contentThemeCategories,
  expressionStyleCategories,
  sourceAttributeCategories,
  timeRegionCategories,
} from '@/constants/article-category'
import { mockArticles } from '@mocks/data/content.data'

const BASE_URL = '/api'

/** 层级分类节点 */
interface CategoryNode {
  value: string
  label: string
  children?: CategoryNode[]
}

/** 递归收集某节点下所有叶子节点的 value，用于"选父类 → 匹配全部子类"的筛选 */
function collectLeafValues(node: CategoryNode): string[] {
  if (!node.children || node.children.length === 0) return [node.value]
  return node.children.flatMap(collectLeafValues)
}

/** 从任意层级数组中按 value 找到叶子 value 集合；若 value 不存在则返回空数组 */
function expandToLeafValues(tree: CategoryNode[], targetValues: string[]): string[] {
  const leafValues: string[] = []
  const walk = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      if (targetValues.includes(node.value)) {
        leafValues.push(...collectLeafValues(node))
      }
      if (node.children?.length) walk(node.children)
    }
  }
  walk(tree)
  return Array.from(new Set(leafValues))
}

/** 解析 query 中的多值参数：支持 ?x=a&x=b 或 ?x=a,b */
function parseMultiParam(url: URL, key: string): string[] {
  const raw = url.searchParams.getAll(key).flatMap((v) => v.split(','))
  return raw.map((v) => v.trim()).filter(Boolean)
}

export const articleHandlers = [
  http.get(`${BASE_URL}/articles/categories`, async () => {
    await delay(200)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: {
        contentTheme: contentThemeCategories,
        expressionStyle: expressionStyleCategories,
        sourceAttribute: sourceAttributeCategories,
        timeRegion: timeRegionCategories,
      },
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
    const keyword = url.searchParams.get('keyword')

    const themeValues = parseMultiParam(url, 'contentTheme')
    const styleValues = parseMultiParam(url, 'expressionStyle')
    const sourceValues = parseMultiParam(url, 'sourceAttribute')
    const regionValues = parseMultiParam(url, 'timeRegion')

    let filtered = mockArticles

    if (themeValues.length > 0) {
      const matchedLeaves = expandToLeafValues(contentThemeCategories, themeValues)
      if (matchedLeaves.length > 0) {
        filtered = filtered.filter((a) => matchedLeaves.includes(a.contentTheme))
      }
    }

    if (styleValues.length > 0) {
      const matchedLeaves = expandToLeafValues(expressionStyleCategories, styleValues)
      if (matchedLeaves.length > 0) {
        filtered = filtered.filter((a) => matchedLeaves.includes(a.expressionStyle))
      }
    }

    if (sourceValues.length > 0) {
      const matchedLeaves = expandToLeafValues(sourceAttributeCategories, sourceValues)
      if (matchedLeaves.length > 0) {
        filtered = filtered.filter((a) => matchedLeaves.includes(a.sourceAttribute))
      }
    }

    if (regionValues.length > 0) {
      const matchedLeaves = expandToLeafValues(timeRegionCategories, regionValues)
      if (matchedLeaves.length > 0) {
        filtered = filtered.filter((a) => matchedLeaves.includes(a.timeRegion))
      }
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(lowerKeyword) ||
          a.summary.toLowerCase().includes(lowerKeyword) ||
          a.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword)),
      )
    }

    const sorted = [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
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
        { status: 404 },
      )
    }

    article.viewCount += 1

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: article,
    })
  }),

  http.patch(`${BASE_URL}/articles/:id/engagement`, async ({ params, request }) => {
    await delay(220)

    const id = Number(params.id)
    const article = mockArticles.find((item) => item.id === id)

    if (!article) {
      return HttpResponse.json(
        { code: 40400, message: '请求资源不存在', data: null },
        { status: 404 },
      )
    }

    const engagement = (await request.json()) as Partial<UpdateArticleEngagementParams>
    const isValidType = engagement.type === 'like' || engagement.type === 'favorite'

    if (!isValidType || typeof engagement.isActive !== 'boolean') {
      return HttpResponse.json(
        { code: 40000, message: '互动参数无效', data: null },
        { status: 400 },
      )
    }

    if (engagement.type === 'like' && article.isLiked !== engagement.isActive) {
      article.isLiked = engagement.isActive
      article.likeCount = Math.max(0, article.likeCount + (engagement.isActive ? 1 : -1))
    }

    if (engagement.type === 'favorite' && article.isFavorited !== engagement.isActive) {
      article.isFavorited = engagement.isActive
      article.favoriteCount = Math.max(
        0,
        article.favoriteCount + (engagement.isActive ? 1 : -1),
      )
    }

    return HttpResponse.json({
      code: 0,
      message: engagement.isActive ? '操作成功' : '已取消',
      data: {
        likeCount: article.likeCount,
        favoriteCount: article.favoriteCount,
        isLiked: article.isLiked,
        isFavorited: article.isFavorited,
      },
    })
  }),
]
