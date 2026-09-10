import type { UserProfile } from '@/api/profile'
import { DEFAULT_PROFILE_AVATAR_URL } from '@/constants/profile'

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

const MOCK_USER_PROFILE: UserProfile = {
  id: 10001,
  displayName: '林知夏',
  username: 'linxia_reader',
  avatarUrl: DEFAULT_PROFILE_AVATAR_URL,
  bio: '在文字里寻找缓慢而坚定的力量。偏爱古典文学、哲思随笔，也记录每一次被句子击中的瞬间。',
  email: 'linxia@example.com',
  website: 'https://linxia.reading.cn',
  joinedAt: '2023-04-18T08:30:00.000Z',
  lastActiveAt: '2026-09-10T05:42:00.000Z',
  stats: {
    readingDays: 428,
    streakDays: 36,
    totalMinutes: 18640,
    favoriteCount: 286,
  },
  readingCalendars: [
    createReadingCalendar(currentYear),
    createReadingCalendar(currentYear - 1),
  ],
  favoriteQuotes: [
    {
      id: 2,
      content: '且视他人之疑目如盏盏鬼火，大胆地去走你的夜路。',
      author: '史铁生',
      source: '病隙碎笔',
      collectedAt: '2026-09-09T13:20:00.000Z',
    },
    {
      id: 4,
      content: '人生天地之间，若白驹之过隙，忽然而已。',
      author: '庄子',
      source: '知北游',
      collectedAt: '2026-09-07T09:12:00.000Z',
    },
    {
      id: 7,
      content: '世界上只有一种真正的英雄主义，就是认清生活的真相后依然热爱生活。',
      author: '罗曼·罗兰',
      source: '米开朗琪罗传',
      collectedAt: '2026-09-02T16:40:00.000Z',
    },
  ],
  recentArticles: [
    {
      id: 5,
      title: '慢生活的艺术：在快节奏时代寻找内心的平静',
      author: '林静心',
      category: '人生',
      readProgress: 100,
      readAt: '2026-09-10T04:28:00.000Z',
    },
    {
      id: 2,
      title: '庄子的逍遥游：追求精神的绝对自由',
      author: '李思远',
      category: '哲学',
      readProgress: 76,
      readAt: '2026-09-09T14:35:00.000Z',
    },
    {
      id: 3,
      title: '《红楼梦》中的人生智慧：从贾宝玉看人性',
      author: '王文心',
      category: '文学',
      readProgress: 42,
      readAt: '2026-09-08T11:06:00.000Z',
    },
  ],
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
