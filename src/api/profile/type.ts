import type { ArticleContentTheme } from '@/api/article/type'

/** 用户累计阅读统计。 */
export interface ProfileStats {
  readingDays: number
  streakDays: number
  totalMinutes: number
  favoriteCount: number
  likeCount: number
}

/** 单日阅读记录。 */
export interface DailyReadingRecord {
  date: string
  minutes: number
}

/** 单个自然年的阅读日历。 */
export interface YearlyReadingCalendar {
  year: number
  days: DailyReadingRecord[]
}

/** 用户收藏的名言。 */
export interface ProfileFavoriteQuote {
  id: number
  content: string
  author: string
  source: string
  collectedAt: string
}

/** 用户最近阅读的文章。 */
export interface ProfileRecentArticle {
  id: number
  title: string
  author: string
  /** 内容主题（contentThemeCategories 叶子 value），用于展示分类标签 */
  contentTheme: ArticleContentTheme
  readProgress: number
  readAt: string
}

/** 个人中心可编辑偏好。 */
export interface ProfilePreferences {
  dailyGoalMinutes: number
  readingDensity: 'compact' | 'comfortable' | 'relaxed'
  dailyQuoteEnabled: boolean
  preferredCategories: string[]
}

/** 个人资料允许编辑的字段。 */
export interface EditableProfileFields {
  displayName: string
  avatarUrl: string
  bio: string
  email: string
  website: string
}

/** 个人中心完整数据。 */
export interface UserProfile {
  id: number
  displayName: string
  username: string
  avatarUrl: string
  bio: string
  email: string
  website: string
  joinedAt: string
  lastActiveAt: string
  stats: ProfileStats
  readingCalendars: YearlyReadingCalendar[]
  favoriteQuotes: ProfileFavoriteQuote[]
  recentArticles: ProfileRecentArticle[]
  preferences: ProfilePreferences
}
