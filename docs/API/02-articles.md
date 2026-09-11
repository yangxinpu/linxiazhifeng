# 02 · 文章模块（Articles）

文章模块提供文章列表、详情和互动操作，支持 4 个维度的层级分类。

## 接口列表

| # | 接口 | 方法 | 路径 | 前端函数 | Mock 覆盖 |
|---|------|------|------|---------|----------|
| 1 | 获取文章分类选项 | `GET` | `/articles/categories` | `getArticleCategories()` | ✅ |
| 2 | 获取最新文章 | `GET` | `/articles/latest` | `getLatestArticles()` | ✅ |
| 3 | 获取文章列表 | `GET` | `/articles` | `getArticleList()` | ✅ |
| 4 | 获取单篇文章 | `GET` | `/articles/:id` | `getArticleById()` | ✅ |
| 5 | 更新文章互动状态 | `PATCH` | `/articles/:id/engagement` | `updateArticleEngagement()` | ✅ |

---

## 1. 获取文章分类选项

返回 4 个维度的层级分类树。每个维度下有一级/二级/三级节点，前端可用于"选中父类 → 自动匹配全部子类"的筛选交互。

**请求**

```
GET /api/articles/categories
```

无请求参数。

**响应 data**

```typescript
interface ArticleCategories {
  contentTheme: Category[]       // 内容主题分类（层级树，含 4 个一级分组共 32 个叶子）
  expressionStyle: Category[]    // 表达方式与文体（层级树，含 4 个一级分组共 30 个叶子）
  sourceAttribute: Category[]    // 来源与应用属性（层级树，含 5 个一级分组共 26 个叶子）
  timeRegion: Category[]         // 时代与地域（层级树，含 4 个一级分组共 11 个叶子）
}
```

每个 `Category` 节点结构：

```typescript
interface Category {
  value: string                  // 分类唯一值（英文），叶子节点对应文章字段实际值
  label: string                  // 展示用中文标签
  children?: Category[]          // 子分类，层级节点有 children，叶子节点无
}
```

### 4 个维度概述

| 维度 | 字段 | 叶子数量 | 典型 value |
|------|------|---------|-----------|
| 内容主题 | `article.contentTheme` | 32 | `biography`(传记)、`thoughtEssay`(杂文)、`sceneLyric`(写景抒情) |
| 表达方式 | `article.expressionStyle` | 30 | `personNarrative`(写人叙事)、`scienceExpository`(科学说明)、`proposal`(倡议书) |
| 来源属性 | `article.sourceAttribute` | 26 | `prose`(散文)、`privateLetter`(私人书信)、`officialAccount`(公众号) |
| 时代地域 | `article.timeRegion` | 11 | `preQinProse`(先秦散文)、`newMediaArticle`(新媒体文章)、`foreignModern`(外国近代) |

> 各维度叶子节点的完整枚举见 [06-data-structures.md](./06-data-structures.md) 的 `ArticleContentTheme` / `ArticleExpressionStyle` / `ArticleSourceAttribute` / `ArticleTimeRegion`。

---

## 2. 获取最新文章

首页展示的精选文章。

**请求**

```
GET /api/articles/latest?limit=6
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | `number` | 否 | 返回条数，默认 5 |

**响应 data**：`Article[]`（按 `createdAt` 倒序）

---

## 3. 获取文章列表

支持 4 维分类筛选、关键词搜索和分页。后端会自动将传入的分类 value（可能是层级节点）递归展开为全部叶子节点值进行匹配。

**请求**

```
GET /api/articles?page=1&pageSize=10&contentTheme=thoughtEssay&expressionStyle=scienceExpository&sourceAttribute=prose&timeRegion=tangSongProse&keyword=自然
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | `number` | 否 | 页码，默认 1 |
| `pageSize` | `number` | 否 | 每页条数，默认 10 |
| `contentTheme` | `string[]` | 否 | 内容主题 value，多值重复键或逗号分隔 |
| `expressionStyle` | `string[]` | 否 | 表达方式 value |
| `sourceAttribute` | `string[]` | 否 | 来源属性 value |
| `timeRegion` | `string[]` | 否 | 时代地域 value |
| `keyword` | `string` | 否 | 关键词，在 title / summary / tags 中模糊匹配 |

**响应 data**：`PaginatedResponse<Article>`

---

## 4. 获取单篇文章

**请求**

```
GET /api/articles/:id
```

| 参数 | 位置 | 类型 | 说明 |
|------|------|------|------|
| `id` | Path | `number` | 文章 ID |

**响应 data**：`Article`

> 注意：调用此接口会使后端 `viewCount` 自动 +1。

**失败场景**

| HTTP | code | message |
|------|------|---------|
| 404 | `40400` | 请求资源不存在 |

---

## 5. 更新文章互动状态

点赞 / 收藏 的切换操作。

**请求**

```
PATCH /api/articles/:id/engagement
```

| 参数 | 位置 | 类型 | 说明 |
|------|------|------|------|
| `id` | Path | `number` | 文章 ID |

**请求体**

```typescript
interface UpdateArticleEngagementParams {
  type: 'like' | 'favorite' // 互动类型
  isActive: boolean         // true 开启 / false 取消
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `'like' \| 'favorite'` | ✅ | 要操作的互动类型 |
| `isActive` | `boolean` | ✅ | 目标状态 |

**响应 data**：`ArticleEngagement`

```typescript
interface ArticleEngagement {
  likeCount: number     // 更新后的点赞数
  favoriteCount: number  // 更新后的收藏数
  isLiked: boolean       // 更新后的点赞状态
  isFavorited: boolean   // 更新后的收藏状态
}
```

**失败场景**

| HTTP | code | message | 说明 |
|------|------|---------|------|
| 400 | `40000` | 互动参数无效 | `type` 非 `like/favorite` 或 `isActive` 非 boolean |
| 404 | `40400` | 请求资源不存在 | 文章不存在 |
