# Linxiazhifeng API 文档

本文档描述 Linxiazhifeng 网站前端所依赖的全部后端接口约定，以 `src/api/` 目录下的 TypeScript 类型定义和函数签名为准。

## 文档结构

| 文件 | 说明 |
|------|------|
| [`00-introduction.md`](./00-introduction.md) | API 简介、全局约定、业务码、HTTP 状态码 |
| [`01-quotes.md`](./01-quotes.md) | 名言模块（6 个接口） |
| [`02-articles.md`](./02-articles.md) | 文章模块（5 个接口） |
| [`03-profile.md`](./03-profile.md) | 个人中心模块（4 个接口） |
| [`04-search.md`](./04-search.md) | 综合搜索模块（1 个接口） |
| [`05-speaking.md`](./05-speaking.md) | 口语练习模块（预留，有 Mock 无前端 API） |
| [`06-data-structures.md`](./06-data-structures.md) | 全部数据结构字段定义 |

## 模块总览

| 模块 | 路径前缀 | 前端 API 模块 | Mock Handler | 接口数量 |
|------|---------|--------------|-------------|---------|
| 名言 Quotes | `/quotes` | `src/api/quote/` | `quote.handler.ts` | 6 |
| 文章 Articles | `/articles` | `src/api/article/` | `article.handler.ts` | 5 |
| 个人中心 Profile | `/profile` | `src/api/profile/` | `profile.handler.ts` | 4 |
| 综合搜索 Search | `/search` | `src/api/search/` | `search.handler.ts` | 1 |
| 口语练习 Speaking | `/speaking` | *(前端未接入)* | `speaking.handler.ts` | 3 |

---

> **注意**：`speaking` 模块目前仅有 Mock Handler，前端尚未创建对应的 `src/api/speaking/` 目录，因此该模块的接口文档标记为"预留"。
