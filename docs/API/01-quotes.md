# 01 · 名言模块（Quotes）

名言模块提供名言列表、详情、分类筛选和互动操作。

## 接口列表

| # | 接口 | 方法 | 路径 | 前端函数 | Mock 覆盖 |
|---|------|------|------|---------|----------|
| 1 | 获取名言分类选项 | `GET` | `/quotes/categories` | `getCategories()` | ✅ |
| 2 | 获取最新名言 | `GET` | `/quotes/latest` | `getLatestQuotes()` | ✅ |
| 3 | 获取名言列表 | `GET` | `/quotes` | `getQuoteList()` | ✅ |
| 4 | 获取单条名言 | `GET` | `/quotes/:id` | `getQuoteById()` | ✅ |
| 5 | 获取名言详情 | `GET` | `/quotes/:id/detail` | `getQuoteDetail()` | ✅ |
| 6 | 更新名言互动状态 | `PATCH` | `/quotes/:id/engagement` | `updateQuoteEngagement()` | ✅ |

---

## 1. 获取名言分类选项

名言列表页的三个筛选维度。

**请求**

```
GET /api/quotes/categories
```

无请求参数。

**响应 data**

```typescript
interface QuoteCategories {
  categories: Category[] // 主题分类（13 项：哲学/文学/科学/人生/智慧/爱情/友情/成功/勇气/教育/自然/艺术/历史）
  forms: Category[]      // 文体分类（格言/警句/诗词/文句名言/谚语俗语）
  regions: Category[]    // 地域分类（中国名言/外国名言）
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `categories` | `Category[]` | 主题分类，`value` 为英文枚举值，如 `"philosophy"`、`"literature"` |
| `forms` | `Category[]` | 文体分类，`value` 为 `"proverb"` / `"aphorism"` / `"poetry"` / `"literary"` / `"folk"` |
| `regions` | `Category[]` | 地域分类，`value` 为 `"china"` / `"foreign"` |

每项 Category 首行固定为 `{ value: "all", label: "全部" }`。

---

## 2. 获取最新名言

首页展示的精选名言。

**请求**

```
GET /api/quotes/latest
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | `number` | 否 | 返回条数，默认 5 |

**响应 data**：`Quote[]`（按 `createdAt` 倒序）

---

## 3. 获取名言列表

支持分类筛选和分页。

**请求**

```
GET /api/quotes?page=1&pageSize=10&category=philosophy&category=life&form=poetry&region=china
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | `number` | 否 | 页码，默认 1 |
| `pageSize` | `number` | 否 | 每页条数，默认 10 |
| `category` | `string[]` | 否 | 主题分类 value，多值重复键传递；`"all"` 视为不过滤 |
| `form` | `string[]` | 否 | 文体分类 value，多值重复键传递 |
| `region` | `string[]` | 否 | 地域分类 value，多值重复键传递 |

**响应 data**：`PaginatedResponse<Quote>`

---

## 4. 获取单条名言

**请求**

```
GET /api/quotes/:id
```

| 参数 | 位置 | 类型 | 说明 |
|------|------|------|------|
| `id` | Path | `number` | 名言 ID |

**成功响应 data**：`Quote`

**失败场景**

| HTTP | code | message |
|------|------|---------|
| 404 | `40400` | 请求资源不存在 |

---

## 5. 获取名言详情

名言详情页专用，在基础名言数据之上补充作者简介、背景故事等扩展信息。

**请求**

```
GET /api/quotes/:id/detail
```

| 参数 | 位置 | 类型 | 说明 |
|------|------|------|------|
| `id` | Path | `number` | 名言 ID |

**响应 data**：`QuoteDetail`（详见数据结构定义）

> 注意：调用此接口会使后端 `viewCount` 自动 +1，视为一次有效浏览。

**失败场景**

| HTTP | code | message |
|------|------|---------|
| 404 | `40400` | 请求资源不存在 |

---

## 6. 更新名言互动状态

点赞 / 收藏 的切换操作。

**请求**

```
PATCH /api/quotes/:id/engagement
```

| 参数 | 位置 | 类型 | 说明 |
|------|------|------|------|
| `id` | Path | `number` | 名言 ID |

**请求体**

```typescript
interface UpdateQuoteEngagementParams {
  type: 'like' | 'favorite' // 互动类型
  isActive: boolean         // true 为开启，false 为取消
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `'like' \| 'favorite'` | ✅ | 要操作的互动类型 |
| `isActive` | `boolean` | ✅ | 目标状态 |

**响应 data**：`QuoteEngagement`

```typescript
interface QuoteEngagement {
  likeCount: number     // 更新后的点赞数
  favoriteCount: number  // 更新后的收藏数
  isLiked: boolean       // 更新后的点赞状态
  isFavorited: boolean   // 更新后的收藏状态
}
```

**失败场景**

| HTTP | code | message | 说明 |
|------|------|---------|------|
| 400 | `40000` | 互动参数无效 | `type` 不是 `like/favorite` 或 `isActive` 非 boolean |
| 404 | `40400` | 请求资源不存在 | 名言不存在 |
