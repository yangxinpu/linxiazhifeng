# 03 · 个人中心模块（Profile）

管理当前登录用户的全部个人中心数据，包含基础资料、阅读统计、收藏足迹和偏好设置。

## 接口列表

| # | 接口 | 方法 | 路径 | 前端函数 | Mock 覆盖 |
|---|------|------|------|---------|----------|
| 1 | 获取个人中心数据 | `GET` | `/profile` | `getUserProfile()` | ✅ |
| 2 | 更新基础资料 | `PATCH` | `/profile` | `updateUserProfile()` | ✅ |
| 3 | 更新阅读偏好 | `PATCH` | `/profile/preferences` | `updateProfilePreferences()` | ✅ |
| 4 | 更新收藏与足迹 | `PATCH` | `/profile/collections` | `updateProfileCollections()` | ✅ |

---

## 1. 获取个人中心数据

一次性返回个人中心页面所需的全部数据。

**请求**

```
GET /api/profile
```

无请求参数。支持 `AbortSignal` 用于页面卸载时取消请求。

**响应 data**：`UserProfile`

```typescript
interface UserProfile {
  id: number                                       // 用户 ID
  displayName: string                              // 昵称（展示用）
  username: string                                 // 登录账号（不可编辑）
  avatarUrl: string                                // 头像 URL
  bio: string                                      // 个人简介 / 座右铭
  email: string                                    // 邮箱
  website: string                                  // 个人主页
  joinedAt: string                                 // 注册时间（ISO 8601）
  lastActiveAt: string                             // 最后活跃时间（ISO 8601）
  stats: ProfileStats                              // 累计阅读统计
  readingCalendars: YearlyReadingCalendar[]         // 按年组织的阅读日历
  favoriteQuotes: ProfileFavoriteQuote[]           // 收藏的名言列表
  recentArticles: ProfileRecentArticle[]            // 最近阅读的文章列表
  preferences: ProfilePreferences                   // 阅读与通知偏好
}
```

### ProfileStats 累计统计

| 字段 | 类型 | 说明 |
|------|------|------|
| `readingDays` | `number` | 累计阅读天数 |
| `streakDays` | `number` | 连续阅读天数（含今日） |
| `totalMinutes` | `number` | 累计阅读分钟数 |
| `favoriteCount` | `number` | 收藏内容总数 |
| `likeCount` | `number` | 点赞内容总数 |

### YearlyReadingCalendar 阅读日历

| 字段 | 类型 | 说明 |
|------|------|------|
| `year` | `number` | 自然年，如 `2026` |
| `days[]` | `DailyReadingRecord[]` | 该年 365/366 天的每日阅读记录 |

**DailyReadingRecord**

| 字段 | 类型 | 说明 |
|------|------|------|
| `date` | `string` | 日期，格式 `YYYY-MM-DD` |
| `minutes` | `number` | 当日阅读分钟数，未来日期为 0 |

### ProfileFavoriteQuote 收藏名言

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 名言 ID，跳转到 `/quote/:id` |
| `content` | `string` | 名言内容 |
| `author` | `string` | 作者 |
| `source` | `string` | 出处 |
| `collectedAt` | `string` | 收藏时间（ISO 8601） |

### ProfileRecentArticle 最近阅读

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 文章 ID |
| `title` | `string` | 标题 |
| `author` | `string` | 作者 |
| `contentTheme` | `ArticleContentTheme` | 内容主题 value，用于展示分类标签 |
| `readProgress` | `number` | 阅读进度百分比（0–100） |
| `readAt` | `string` | 阅读时间（ISO 8601） |

### ProfilePreferences 阅读偏好

| 字段 | 类型 | 说明 |
|------|------|------|
| `dailyGoalMinutes` | `number` | 每日阅读目标（分钟），范围 10–120 |
| `readingDensity` | `'compact' \| 'comfortable' \| 'relaxed'` | 列表间距密度 |
| `dailyQuoteEnabled` | `boolean` | 是否开启每日一句推送 |
| `preferredCategories` | `string[]` | 偏好的内容分类（可自由输入） |

---

## 2. 更新基础资料

**请求**

```
PATCH /api/profile
```

**请求体**：`EditableProfileFields`

```typescript
interface EditableProfileFields {
  displayName: string // 昵称，最长 20 字符
  avatarUrl: string   // 头像 URL（用户上传后返回）
  bio: string         // 座右铭，最长 80 字符
  email: string       // 邮箱地址
  website: string     // 个人主页 URL
}
```

**响应 data**：`UserProfile`（更新后的完整数据）

---

## 3. 更新阅读偏好

**请求**

```
PATCH /api/profile/preferences
```

**请求体**：`Partial<ProfilePreferences>`（所有字段可选，只传要更新的字段）

**响应 data**：`ProfilePreferences`（更新后的完整偏好）

---

## 4. 更新收藏与足迹

用于删除单条收藏名言或清理最近阅读记录。前端通常传完整的新数组覆盖对应字段。

**请求**

```
PATCH /api/profile/collections
```

**请求体**

```typescript
{
  favoriteQuotes?: ProfileFavoriteQuote[]   // 新的收藏名言列表（可选）
  recentArticles?: ProfileRecentArticle[]   // 新的最近阅读列表（可选）
}
```

两个字段均为可选；不传的字段保持原值不变。后端会根据新 `favoriteQuotes.length` 自动更新 `stats.favoriteCount`。

**响应 data**：`UserProfile`（更新后的完整数据）
