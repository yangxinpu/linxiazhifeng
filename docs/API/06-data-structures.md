# 06 · 数据结构定义

本文档汇总全部接口返回的数据结构，方便快速查阅字段含义和类型。所有定义以 `src/api/` 目录下的 TypeScript 类型为准。

---

## 全局通用结构

### ApiResponse\<T\> 统一响应

所有接口外层包装。

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `number` | 业务码，0 成功 |
| `message` | `string` | 业务提示 |
| `data` | `T` | 业务数据（泛型） |

### PaginatedResponse\<T\> 分页响应

列表类接口返回。

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | `T[]` | 当前页数据 |
| `total` | `number` | 符合条件的总记录数 |
| `page` | `number` | 当前页码（1-based） |
| `pageSize` | `number` | 每页大小 |

### Category 通用分类

扁平分类选项（用于名言、搜索等）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `value` | `string` | 分类唯一值 |
| `label` | `string` | 展示用中文标签 |

### CategoryNode 层级分类

文章模块专用，递归嵌套。

| 字段 | 类型 | 说明 |
|------|------|------|
| `value` | `string` | 分类唯一值 |
| `label` | `string` | 展示用中文标签 |
| `children` | `CategoryNode[]?` | 子分类（可选，叶子节点无此字段） |

---

## 名言模块

### Quote 名言列表项

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 名言 ID |
| `content` | `string` | 名言正文 |
| `author` | `string` | 作者 |
| `source` | `string` | 出处（如《论语》） |
| `category` | `QuoteCategory` | 主题分类 value |
| `form` | `QuoteForm?` | 文体分类（可选） |
| `region` | `QuoteRegion?` | 地域分类（可选） |
| `detailId` | `number` | 对应详情记录 ID（一对一） |
| `background` | `string?` | 背景配图 URL（可选） |
| `viewCount` | `number` | 浏览次数 |
| `likeCount` | `number` | 点赞数 |
| `favoriteCount` | `number` | 收藏数 |
| `isLiked` | `boolean` | 当前用户是否已点赞 |
| `isFavorited` | `boolean` | 当前用户是否已收藏 |
| `createdAt` | `string` | 发布时间 |

### QuoteDetail 名言详情

在 `Quote` 基础上扩展，多出以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `quoteId` | `number` | 关联的 Quote 列表项 ID |
| `authorBio` | `string` | 作者简介 |
| `story` | `string` | 名言背后的故事 |
| `background` | `string` | 背景介绍（比列表项的 background 更详细） |

### QuoteCategories 分类组合

```typescript
{
  categories: Category[] // 13 项主题分类
  forms: Category[]      // 5 项文体分类
  regions: Category[]    // 2 项地域分类
}
```

### QuoteEngagement 互动状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `likeCount` | `number` | 点赞数 |
| `favoriteCount` | `number` | 收藏数 |
| `isLiked` | `boolean` | 当前点赞状态 |
| `isFavorited` | `boolean` | 当前收藏状态 |

### 名言分类 value 枚举

**QuoteCategory 主题分类**（13 项）
`philosophy` · `literature` · `science` · `life` · `wisdom` · `love` · `friendship` · `success` · `courage` · `education` · `nature` · `art` · `history`

**QuoteForm 文体分类**（5 项）
`proverb`(格言) · `aphorism`(警句) · `poetry`(诗词) · `literary`(文句名言) · `folk`(谚语俗语)

**QuoteRegion 地域分类**（2 项）
`china` · `foreign`

---

## 文章模块

### Article 文章

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 文章 ID |
| `title` | `string` | 标题 |
| `summary` | `string` | 摘要 |
| `content` | `string` | 正文（Markdown / HTML 字符串） |
| `author` | `string` | 作者 |
| `contentTheme` | `ArticleContentTheme` | 内容主题 value |
| `expressionStyle` | `ArticleExpressionStyle` | 表达方式 value |
| `sourceAttribute` | `ArticleSourceAttribute` | 来源属性 value |
| `timeRegion` | `ArticleTimeRegion` | 时代地域 value |
| `cover` | `string?` | 封面图 URL（可选） |
| `tags` | `string[]` | 标签列表 |
| `viewCount` | `number` | 浏览次数 |
| `likeCount` | `number` | 点赞数 |
| `favoriteCount` | `number` | 收藏数 |
| `isLiked` | `boolean` | 当前用户点赞状态 |
| `isFavorited` | `boolean` | 当前用户收藏状态 |
| `createdAt` | `string` | 发布时间 |
| `updatedAt` | `string` | 更新时间 |

### ArticleCategories 分类组合

```typescript
{
  contentTheme: CategoryNode[]      // 内容主题层级树
  expressionStyle: CategoryNode[]   // 表达方式层级树
  sourceAttribute: CategoryNode[]   // 来源属性层级树
  timeRegion: CategoryNode[]        // 时代地域层级树
}
```

### ArticleEngagement 互动状态

| 字段 | 类型 | 说明 |
|------|------|------|
| `likeCount` | `number` | 点赞数 |
| `favoriteCount` | `number` | 收藏数 |
| `isLiked` | `boolean` | 当前点赞状态 |
| `isFavorited` | `boolean` | 当前收藏状态 |

### 文章 4 维度叶子 value 枚举

**ArticleContentTheme 内容主题**（32 项）
`biography`(传记) · `growth`(成长感悟) · `event`(记事写事) · `memoir`(回忆录) · `travel`(游记) · `custom`(民俗) · `artifact`(器物记) · `animalPlant`(动植物记) · `sceneLyric`(写景抒情) · `objectAspiration`(托物言志) · `directEmotion`(直接抒情) · `historyReflection`(历史沉思) · `lifeInsight`(人生感悟) · `viewpoint`(阐述观点) · `reasonAnalysis`(因果分析) · `thoughtEssay`(思想随笔) · `currentComment`(时事评论) · `cultureComment`(文化评论) · `phenomenonAnalysis`(现象分析) · `viewDebate`(观点辩论) · `thingIntro`(事物介绍) · `reasonExplain`(道理说明) · `knowledgePopularize`(知识普及) · `experimentReport`(实验报告) · `dailyInsight`(日常感悟) · `readingNotes`(读书笔记) · `travelNotes`(旅行笔记) · `experienceShare`(经验分享) · `patriotism`(爱国情怀) · `historyThought`(历史思考) · `socialIdeal`(社会理想) · `peopleConcern`(人文关怀)

**ArticleExpressionStyle 表达方式**（30 项）
`personNarrative`(写人叙事) · `eventNarrative`(写事叙事) · `sceneNarrative`(写景叙事) · `objectNarrative`(写物叙事) · `thingExpository`(事物说明) · `reasonExpository`(事理说明) · `procedureExpository`(程序说明) · `scienceExpository`(科学说明) · `positiveEssay`(立论) · `refutationEssay`(驳论) · `thoughtComment`(思想评论) · `currentEssay`(时评) · `notice`(通知) · `report`(报告) · `officialLetter`(公函) · `decision`(决定) · `letter`(书信) · `diary`(日记) · `leaveNote`(请假条) · `application`(申请书) · `resume`(简历) · `summary`(总结) · `plan`(计划) · `workReport`(工作汇报) · `pressRelease`(新闻稿) · `speech`(演讲稿) · `manual`(说明书) · `proposal`(倡议书)

**ArticleSourceAttribute 来源属性**（26 项）
`prose`(散文) · `novel`(小说) · `poetry`(诗歌) · `essay`(杂文) · `drama`(戏剧) · `academicPaper`(学术论文) · `researchReport`(研究报告) · `literatureReview`(文学评论) · `thesis`(学位论文) · `investigationReport`(调查报告) · `administrativeDocument`(行政公文) · `businessLetter`(商业信函) · `contract`(合同) · `workPlan`(工作计划) · `workSummary`(工作总结) · `privateLetter`(私人书信) · `personalDiary`(个人日记) · `readingExcerpts`(读书摘录) · `initiativeNote`(倡议短文) · `note`(便条) · `officialAccount`(公众号) · `column`(专栏) · `shortVideoCopy`(短视频文案) · `qaContent`(问答内容) · `recommendationNote`(推荐语)

**ArticleTimeRegion 时代地域**（11 项）
`preQinProse`(先秦散文) · `historicalBiography`(史传文学) · `tangSongProse`(唐宋古文) · `mingQingEssay`(明清小品) · `newCultureMovement`(新文化运动以来) · `foundingToReform`(建国至改革开放) · `traditionalMedia`(传统媒体) · `newMediaArticle`(新媒体文章) · `foreignAncient`(外国古典) · `foreignModern`(外国近代) · `foreignContemporary`(外国当代)

---

## 个人中心模块

### UserProfile 个人中心完整数据

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 用户 ID |
| `displayName` | `string` | 昵称（展示名） |
| `username` | `string` | 登录账号（不可编辑） |
| `avatarUrl` | `string` | 头像 URL |
| `bio` | `string` | 个人简介 / 座右铭 |
| `email` | `string` | 邮箱 |
| `website` | `string` | 个人主页 |
| `joinedAt` | `string` | 注册时间（ISO 8601） |
| `lastActiveAt` | `string` | 最后活跃时间（ISO 8601） |
| `stats` | `ProfileStats` | 累计阅读统计 |
| `readingCalendars` | `YearlyReadingCalendar[]` | 按年组织的阅读日历 |
| `favoriteQuotes` | `ProfileFavoriteQuote[]` | 收藏的名言列表 |
| `recentArticles` | `ProfileRecentArticle[]` | 最近阅读的文章列表 |
| `preferences` | `ProfilePreferences` | 阅读偏好 |

### ProfileStats 累计统计

| 字段 | 类型 | 说明 |
|------|------|------|
| `readingDays` | `number` | 累计阅读天数 |
| `streakDays` | `number` | 连续阅读天数 |
| `totalMinutes` | `number` | 累计阅读分钟数 |
| `favoriteCount` | `number` | 收藏总数 |
| `likeCount` | `number` | 点赞总数 |

### YearlyReadingCalendar 年度日历

| 字段 | 类型 | 说明 |
|------|------|------|
| `year` | `number` | 自然年 |
| `days[]` | `{ date: string, minutes: number }[]` | 每日阅读分钟数，按日期升序，未来日期 minutes=0 |

### ProfileFavoriteQuote 收藏名言

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 名言 ID |
| `content` | `string` | 名言内容 |
| `author` | `string` | 作者 |
| `source` | `string` | 出处 |
| `collectedAt` | `string` | 收藏时间 |

### ProfileRecentArticle 最近阅读

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 文章 ID |
| `title` | `string` | 标题 |
| `author` | `string` | 作者 |
| `contentTheme` | `ArticleContentTheme` | 内容主题 value |
| `readProgress` | `number` | 阅读进度（0–100） |
| `readAt` | `string` | 阅读时间 |

### ProfilePreferences 阅读偏好

| 字段 | 类型 | 说明 |
|------|------|------|
| `dailyGoalMinutes` | `number` | 每日目标（分钟） |
| `readingDensity` | `'compact' \| 'comfortable' \| 'relaxed'` | 列表间距密度 |
| `dailyQuoteEnabled` | `boolean` | 是否开启每日一句 |
| `preferredCategories` | `string[]` | 偏好分类（可自由输入） |

### EditableProfileFields 可编辑字段

用于更新资料接口的请求体，是 `UserProfile` 的子集（不含 username、stats、readingCalendars 等）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `displayName` | `string` | 昵称（最长 20） |
| `avatarUrl` | `string` | 头像 URL |
| `bio` | `string` | 座右铭（最长 80） |
| `email` | `string` | 邮箱 |
| `website` | `string` | 个人主页 URL |

---

## 搜索模块

### SearchResult 搜索结果

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 业务 ID（名言或文章） |
| `type` | `'quote' \| 'article'` | 业务类型 |
| `title` | `string` | 名言内容（quote）或文章标题（article） |
| `excerpt` | `string` | 名言出处（quote）或文章摘要（article） |
| `author` | `string` | 作者 |
