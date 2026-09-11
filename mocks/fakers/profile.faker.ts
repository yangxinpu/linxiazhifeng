import type { UserProfile } from '@/api/profile'
import { mockArticles, mockQuotes } from '@mocks/data/content.data'

const DEFAULT_AVATAR = 'https://avatars.githubusercontent.com/u/187100212?v=4'

/** 生成稳定的年度阅读记录，未来日期保持为空白。 */
function createReadingCalendar(year: number): UserProfile['readingCalendars'][number] {
  const startDate = new Date(Date.UTC(year, 0, 1))
  const endDate = new Date(Date.UTC(year + 1, 0, 1))
  const today = new Date()
  const days = []

  for (
    let currentDate = new Date(startDate), dayIndex = 0;
    currentDate < endDate;
    currentDate.setUTCDate(currentDate.getUTCDate() + 1), dayIndex += 1
  ) {
    const isFutureDate = currentDate.getTime() > today.getTime()
    const isRestDay = (dayIndex * 7 + year) % 11 === 0
    const minutes = isFutureDate || isRestDay ? 0 : 12 + ((dayIndex * 17 + year) % 64)

    days.push({
      date: currentDate.toISOString().slice(0, 10),
      minutes,
    })
  }

  return { year, days }
}

const currentYear = new Date().getUTCFullYear()

/** 从共享 mockQuotes 中挑选收藏名言，确保 id→内容 与 quote 详情页一致 */
const FAVORITE_QUOTE_IDS = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39]

const favoriteQuotes: UserProfile['favoriteQuotes'] = FAVORITE_QUOTE_IDS
  .map((id) => {
    const quote = mockQuotes.find((q) => q.id === id)
    if (!quote) return null
    // 从最近时间向前推算收藏时间
    const daysAgo = FAVORITE_QUOTE_IDS.indexOf(id) * 2 + 1
    const collectedAt = new Date(Date.now() - daysAgo * 86400000).toISOString()
    return {
      id: quote.id,
      content: quote.content,
      author: quote.author,
      source: quote.source,
      collectedAt,
    }
  })
  .filter((item): item is UserProfile['favoriteQuotes'][number] => item !== null)

/** 从共享 mockArticles 中生成最近阅读记录，确保 id→文章 与 article 详情页一致 */
const recentArticles: UserProfile['recentArticles'] = mockArticles
  .slice()
  .sort((a, b) => b.id - a.id)
  .slice(0, 12)
  .map((article, index) => {
    const daysAgo = index * 3
    const readAt = new Date(Date.now() - daysAgo * 86400000).toISOString()
    const readProgress = [100, 76, 42, 100, 88, 60, 100, 34, 100, 72, 50, 100][index] || 68
    return {
      id: article.id,
      title: article.title,
      author: article.author,
      contentTheme: article.contentTheme,
      readProgress,
      readAt,
    }
  })

const MOCK_USER_PROFILE: UserProfile = {
  id: 10001,
  displayName: '林知夏',
  username: 'linxia_reader',
  avatarUrl: DEFAULT_AVATAR,
  bio: '在文字里寻找缓慢而坚定的力量。偏爱古典文学、哲思随笔，也记录每一次被句子击中的瞬间。',
  email: 'linxia@example.com',
  website: 'https://linxia.reading.cn',
  joinedAt: '2023-04-18T08:30:00.000Z',
  lastActiveAt: '2026-09-10T05:42:00.000Z',
  stats: {
    readingDays: 428,
    streakDays: 36,
    totalMinutes: 18640,
    favoriteCount: favoriteQuotes.length,
    likeCount: 512,
  },
  readingCalendars: [
    createReadingCalendar(currentYear),
    createReadingCalendar(currentYear - 1),
  ],
  favoriteQuotes,
  recentArticles,
  preferences: {
    dailyGoalMinutes: 30,
    readingDensity: 'comfortable',
    dailyQuoteEnabled: true,
    preferredCategories: ['文学', '哲学', '人生', '历史'],
  },
}

/** 创建隔离的个人中心 Mock 数据。 */
export function createMockUserProfile(): UserProfile {
  return structuredClone(MOCK_USER_PROFILE)
}
