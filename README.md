# Linxiazhifeng

林下之风是一个面向中文阅读场景的名言与经典文章聚合前端。项目提供名言、文章的浏览与详情阅读，并通过本地 Mock API 支持独立开发。

## 功能

- 首页展示最新名言、站点入口和可拖动的 Canvas 树叶球动画
- 名言分类筛选、分页加载、无限滚动和详情阅读
- 文章分页加载、无限滚动和详情阅读
- 个人中心展示阅读档案、年度阅读绿墙、收藏足迹与阅读偏好
- Header 综合搜索支持搜索历史、模糊匹配和内容推荐
- 深色与浅色主题切换及本地持久化
- 响应式 Header、移动端导航、全局加载页和 404 页面
- 开发环境自动启用 MSW，提供名言、文章、个人中心、综合搜索和口语学习 Mock 接口

当前功能边界：

- 口语学习模块目前只有 Mock 数据和接口，没有对应页面与路由
- `VirtualList` 组件目前未被页面使用
- 项目暂未配置自动化测试框架

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端 | React 19、TypeScript 6 |
| 构建 | Vite 8、pnpm |
| 路由 | React Router 7 |
| 状态 | Redux Toolkit、React Redux |
| UI | Ant Design、Ant Design Icons |
| 样式 | Sass、SCSS Modules、CSS 自定义属性 |
| 请求 | Axios |
| 提示 | Sonner、Ant Design Message |
| Mock | MSW、Faker |
| 规范 | ESLint 10、typescript-eslint |

## 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- pnpm，推荐使用与当前环境一致的 pnpm 11

## 本地开发

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:9090`。如果端口已被占用，Vite 会自动选择其他端口。

开发模式会在应用挂载前启动 MSW，未匹配的请求将直接放行。

## 常用命令

```bash
# 启动开发服务器
pnpm dev

# ESLint 检查
pnpm lint

# TypeScript 检查并生成生产构建
pnpm build

# 预览生产构建
pnpm preview
```

## 页面路由

| 路径 | 页面 |
| --- | --- |
| `/` | 首页 |
| `/quotes` | 名言列表 |
| `/quote` | 名言列表兼容入口 |
| `/quote/:id` | 名言详情 |
| `/articles` | 文章列表 |
| `/article/:id` | 文章详情 |
| `/profile` | 个人中心 |
| `*` | 404 页面 |

页面通过 `React.lazy` 按路由拆分，并统一挂载在主布局的 `Outlet` 中。

## 项目结构

```text
.
├── docs/                         # 内容资料
├── mocks/
│   ├── fakers/                   # Mock 数据生成器
│   ├── handlers/                 # MSW 请求处理器
│   ├── browser.ts                # 浏览器端 MSW
│   └── server.ts                 # Node 环境 MSW
├── public/
│   └── mockServiceWorker.js      # MSW 生成文件
├── src/
│   ├── api/                      # Axios 客户端、接口函数和类型
│   ├── assets/                   # 静态资源
│   ├── components/               # 通用组件
│   ├── hooks/                    # 请求、搜索、主题、加载和无限滚动 Hooks
│   ├── layout/                   # 主布局、加载页和 404 页面
│   ├── pages/                    # 首页、名言、文章及详情页
│   ├── stores/                   # Redux store 与状态切片
│   ├── styles/
│   │   ├── global.scss           # 全局 reset 与基础样式
│   │   └── variable.scss         # 全局 CSS 变量和主题变量
│   ├── utils/                    # 通用工具
│   ├── App.tsx                   # 路由配置
│   └── main.tsx                  # 应用启动入口
├── vite.config.ts
└── package.json
```

## 数据访问

所有业务请求通过 `src/api/http-client.ts` 中的 Axios 实例发送：

- 基础路径：`/api`
- 超时时间：10 秒
- 响应格式：`{ code, message, data }`
- `code !== 0` 时统一转为异常
- 如果 `localStorage` 中存在 `token`，请求会自动携带 Bearer Token

开发环境中的主要 Mock 接口：

```text
GET /api/quotes
GET /api/quotes/latest
GET /api/quotes/categories
GET /api/quotes/:id
GET /api/quotes/:id/detail

GET /api/articles
GET /api/articles/latest
GET /api/articles/categories
GET /api/articles/:id

GET /api/profile
PATCH /api/profile
PATCH /api/profile/preferences

GET /api/search

GET /api/speaking/books
GET /api/speaking/books/:id
GET /api/speaking/books/:bookId/articles/:articleId
```

生产构建不会启动 MSW，部署环境需要提供对应的 `/api` 服务或配置反向代理。

## 样式与主题

- 页面与组件样式使用相邻的 `index.module.scss`
- CSS Module 类名在 TSX 中使用 camelCase
- 全局颜色、尺寸、圆角和阴影变量集中维护在 `src/styles/variable.scss`
- `src/styles/global.scss` 只维护 reset、基础元素样式和无障碍动画降级
- 深色主题通过根元素的 `.dark` 类切换
- 响应式布局以现有断点和 `--layout-gutter` 为基础

## 路径别名

```text
@/*       -> src/*
@mocks/*  -> mocks/*
```

别名同时配置在 `vite.config.ts` 和 TypeScript 配置中，修改时需要保持同步。

## License

[MIT](./LICENSE)
