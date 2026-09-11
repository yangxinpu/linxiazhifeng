# 04 · 综合搜索模块（Search）

网站顶部导航栏的综合搜索接口，同时搜索名言和文章两类内容。

## 接口列表

| # | 接口 | 方法 | 路径 | 前端函数 | Mock 覆盖 |
|---|------|------|------|---------|----------|
| 1 | 综合搜索 | `GET` | `/search` | `getSearchResults()` | ✅ |

---

## 1. 综合搜索

**请求**

```
GET /api/search?keyword=自然&limit=8
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `keyword` | `string` | 否 | 搜索关键词。空字符串或不传时返回热门内容（按热度倒序） |
| `limit` | `number` | 否 | 返回条数，默认 8，最大 20 |

支持 `AbortSignal` 用于输入联想时取消上一次请求。

**响应 data**：`SearchResult[]`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `number` | 业务 ID（名言或文章的自身 ID） |
| `type` | `'quote' \| 'article'` | 业务类型，前端据此跳转到 `/quote/:id` 或 `/article/:id` |
| `title` | `string` | 名言内容（quote）或文章标题（article） |
| `excerpt` | `string` | 名言出处（quote，如《论语》）或文章摘要（article） |
| `author` | `string` | 作者 |

### 搜索排序规则

1. **关键词非空时**：同时在标题、作者、出处、标签、分类标签等字段做模糊匹配，计算字符间距得分 → 得分高者优先 → 同分时按热度（文章 likeCount / 名言发布顺序）倒序
2. **关键词为空时**：直接按热度倒序返回

### Mock 实现的搜索字段

| 业务类型 | 参与匹配的字段 |
|---------|---------------|
| 名言 quote | content、author、source、category（中文 label） |
| 文章 article | title、summary、author、tags、contentTheme、expressionStyle、sourceAttribute、timeRegion（中文 label） |
