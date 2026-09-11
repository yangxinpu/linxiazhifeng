# 05 · 口语练习模块（Speaking）· 预留

> **当前状态**：仅有 Mock Handler（`mocks/handlers/speaking.handler.ts`），前端尚未创建对应的 `src/api/speaking/` 目录，也没有页面消费这些接口。本文档基于 Mock Handler 和 faker 数据结构整理，供后续接入时参考。

## 接口列表

| # | 接口 | 方法 | 路径 | Mock 覆盖 |
|---|------|------|------|----------|
| 1 | 获取口语书本列表 | `GET` | `/speaking/books` | ✅ |
| 2 | 获取口语书本详情 | `GET` | `/speaking/books/:id` | ✅ |
| 3 | 获取单篇口语文章 | `GET` | `/speaking/books/:bookId/articles/:articleId` | ✅ |

---

## 1. 获取口语书本列表

**请求**

```
GET /api/speaking/books?page=1&pageSize=12&level=intermediate&category=business
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | `number` | 否 | 页码，默认 1 |
| `pageSize` | `number` | 否 | 每页条数，默认 12 |
| `level` | `string` | 否 | 难度等级：`beginner` / `intermediate` / `advanced` |
| `category` | `string` | 否 | 场景分类：`daily` / `business` / `travel` / `academic` / `social` |

**响应 data**：`PaginatedResponse<SpeakingBook>`

### SpeakingBook

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 书本 ID |
| `title` | `string` | 书本标题 |
| `description` | `string` | 书本简介 |
| `cover` | `string?` | 封面 URL |
| `level` | `'beginner' \| 'intermediate' \| 'advanced'` | 难度等级 |
| `category` | `'daily' \| 'business' \| 'travel' \| 'academic' \| 'social'` | 场景分类 |
| `articleCount` | `number` | 包含的口语文章数量 |
| `duration` | `number` | 总时长（分钟） |
| `rating` | `number` | 评分（3.5–5.0） |
| `createdAt` | `string` | 创建时间（ISO 8601） |

---

## 2. 获取口语书本详情

返回书本基础信息 + 全部口语文章列表。

**请求**

```
GET /api/speaking/books/:id
```

| 参数 | 位置 | 类型 | 说明 |
|------|------|------|------|
| `id` | Path | `number` | 书本 ID |

**响应 data**：SpeakingBook（额外包含 `articles: SpeakingArticle[]` 字段）

### SpeakingArticle

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 文章 ID |
| `bookId` | `number` | 所属书本 ID |
| `title` | `string` | 文章标题 |
| `content` | `string` | 英文原文 |
| `translation` | `string` | 中文翻译 |
| `audioUrl` | `string?` | 音频 URL（可选） |
| `duration` | `number` | 音频时长（秒） |
| `difficulty` | `'easy' \| 'medium' \| 'hard'` | 难度 |
| `keywords` | `string[]` | 关键词列表 |
| `tips` | `string[]` | 口语练习小贴士 |
| `order` | `number` | 在书本中的排序号 |
| `createdAt` | `string` | 创建时间 |

**失败场景**

| HTTP | code | message |
|------|------|---------|
| 404 | `40400` | 书本不存在 |

---

## 3. 获取单篇口语文章

**请求**

```
GET /api/speaking/books/:bookId/articles/:articleId
```

| 参数 | 位置 | 类型 | 说明 |
|------|------|------|------|
| `bookId` | Path | `number` | 书本 ID |
| `articleId` | Path | `number` | 文章 ID |

**响应 data**：`SpeakingArticle`

**失败场景**

| HTTP | code | message | 说明 |
|------|------|---------|------|
| 404 | `40400` | 书本不存在 | bookId 不存在 |
| 404 | `40400` | 文章不存在 | articleId 不存在 |
