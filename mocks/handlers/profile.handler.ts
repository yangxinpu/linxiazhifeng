import { delay, http, HttpResponse } from 'msw'
import type {
  EditableProfileFields,
  ProfilePreferences,
  ProfileFavoriteQuote,
  ProfileRecentArticle,
} from '@/api/profile'
import { createMockUserProfile } from '@mocks/fakers/profile.faker'

const BASE_URL = '/api'

let profile = createMockUserProfile()

export const profileHandlers = [
  http.get(`${BASE_URL}/profile`, async () => {
    await delay(320)

    return HttpResponse.json({
      code: 0,
      message: '请求成功',
      data: profile,
    })
  }),

  http.patch(`${BASE_URL}/profile`, async ({ request }) => {
    await delay(280)

    const editableProfile = await request.json() as EditableProfileFields
    profile = {
      ...profile,
      ...editableProfile,
    }

    return HttpResponse.json({
      code: 0,
      message: '个人资料已更新',
      data: profile,
    })
  }),

  http.patch(`${BASE_URL}/profile/preferences`, async ({ request }) => {
    await delay(260)

    const preferences = await request.json() as Partial<ProfilePreferences>
    profile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        ...preferences,
      },
    }

    return HttpResponse.json({
      code: 0,
      message: '偏好设置已更新',
      data: profile.preferences,
    })
  }),

  http.patch(`${BASE_URL}/profile/collections`, async ({ request }) => {
    await delay(240)

    const payload = (await request.json()) as {
      favoriteQuotes?: ProfileFavoriteQuote[]
      recentArticles?: ProfileRecentArticle[]
    }

    profile = {
      ...profile,
      favoriteQuotes: payload.favoriteQuotes ?? profile.favoriteQuotes,
      recentArticles: payload.recentArticles ?? profile.recentArticles,
      stats: {
        ...profile.stats,
        favoriteCount: payload.favoriteQuotes?.length ?? profile.stats.favoriteCount,
      },
    }

    return HttpResponse.json({
      code: 0,
      message: '收藏已更新',
      data: profile,
    })
  }),
]
