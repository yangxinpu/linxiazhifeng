# AGENTS.md

本文档适用于仓库根目录及其全部子目录，为自动化代码代理提供项目约束和执行规范。

## 项目概览

Linxiazhifeng（GroveGrace）是一个中文名言与经典文章阅读前端。

- 技术栈：React 19、TypeScript 6、Vite 8
- 路由：React Router 7
- 状态：Redux Toolkit、React Redux
- UI：Ant Design、Ant Design Icons
- 样式：SCSS Modules、CSS 自定义属性
- 请求：Axios
- 开发数据：MSW、Faker
- 包管理器：pnpm

## 常用命令

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm preview
```

提交改动前至少运行：

```bash
pnpm lint
pnpm build
```

项目当前没有自动化测试命令。除非用户明确要求，否则不要启动浏览器自动化测试。

## 架构边界

### 应用入口与路由

- `src/main.tsx` 负责启动 MSW、挂载 Redux Provider 和渲染应用。
- `src/App.tsx` 负责全局加载状态、懒加载页面和声明路由。
- 页面默认通过 `React.lazy` 加载。
- 主布局使用嵌套路由和 `Outlet`，不要在页面中重复实现全局 Header 或 Footer。

### 页面与组件

- 路由页面放在 `src/pages/<page-name>/`。
- 全局可复用组件放在 `src/components/`。
- 布局组件放在 `src/layout/`。
- Header 和 Footer 分别维护在：
  - `src/layout/main/components/header-section/`
  - `src/layout/main/components/footer-section/`
- 组件应保持单一职责；共享逻辑优先提取到 Hook。

### API

- 所有 HTTP 请求必须经过 `src/api/http-client.ts`。
- 业务接口按领域放在 `src/api/article/`、`src/api/quote/` 等目录。
- 页面不得直接创建 Axios 实例或硬编码完整后端地址。
- 接口响应统一使用 `ApiResponse<T>`。
- 成功业务码为 `0`；非零业务码由请求层转为异常。
- 新增 API 时同时补充参数类型、响应类型和对应 Mock handler。

### 状态与 Hooks

- Redux store 配置位于 `src/stores/store.ts`。
- Redux slice 位于 `src/stores/slices/`。
- React Hooks 位于 `src/hooks/`，并从 `src/hooks/index.ts` 统一导出。
- Hook 返回给 Effect 使用的函数应通过 `useCallback` 保持引用稳定。
- 不要把 React Hook 放入 `src/stores/`。
- 全局状态只存放跨页面共享状态；页面局部状态继续使用 React state。

### Mock

- 开发模式由 `src/main.tsx` 自动启动 MSW。
- Handler 位于 `mocks/handlers/`，数据生成器位于 `mocks/fakers/`。
- Mock 接口必须保持 `{ code, message, data }` 响应结构。
- 修改领域类型时同步更新 API 类型、faker 和 handler。
- `public/mockServiceWorker.js` 是生成文件，不要手动编辑。
- 生产构建不启用 MSW，不能假设生产环境存在 Mock 数据。

## 编码规范

### TypeScript

- 使用严格类型，禁止无必要的 `any`、类型断言和非空断言。
- 类型导入使用 `import type`。
- 除非需要重新赋值，否则使用 `const`。
- 布尔变量使用 `is`、`has`、`should` 前缀。
- 数组使用复数名词。
- 导出的 Hook、组件辅助函数和关键工具应添加简短 JSDoc。

### React

- 仅使用函数组件和 Hooks。
- 保持 Effect 依赖完整，不通过禁用 ESLint 规则掩盖依赖问题。
- 异步 Effect 必须处理失败和组件生命周期风险。
- 列表元素使用稳定业务 ID 作为 key；仅在没有稳定 ID 时使用索引。
- 可点击的非按钮元素必须提供键盘行为、语义角色和焦点能力，或改用 Ant Design Button/Link。

### 命名与导入

- 页面和布局目录使用小写 kebab-case。
- Hook 文件遵循现有 `useXxx.ts` / `useXxx.tsx` 形式。
- 优先使用别名：
  - `@/*` 指向 `src/*`
  - `@mocks/*` 指向 `mocks/*`
- 公共模块通过已有 barrel 文件导出：`src/api/index.ts`、`src/hooks/index.ts`、`src/stores/index.ts`、`src/utils/index.ts`。
- 路径大小写必须与文件系统和 Git 中记录的名称完全一致。

## UI 与样式规范

- 常规控件、布局和图标优先使用 Ant Design 及 `@ant-design/icons`。
- 自定义视觉与响应式布局使用 SCSS Modules。
- 禁止重新引入 Tailwind CSS 类或 `@apply`。
- 组件样式放在同目录的 `index.module.scss`。
- CSS Module 类名使用 camelCase，与 Vite 的 `localsConvention` 配置一致。
- 全局 CSS 变量只定义在 `src/styles/variable.scss`。
- `src/styles/global.scss` 只维护 reset、基础元素规则和全局无障碍行为。
- 优先使用现有颜色、圆角、阴影和布局变量，不重复硬编码设计值。
- 静态样式不得写入 JSX `style`；只有运行时计算值可通过 CSS 自定义属性传入。
- Header 和 Footer 保持全宽，使用 `--layout-gutter` 提供响应式水平留白。
- 保持浅色与深色主题同时可读，修改颜色时检查 `.dark` 变量覆盖。
- 修改主题持久化时，必须同步检查 `index.html` 的启动脚本和 `src/hooks/useTheme.tsx` 的存储键。

## 当前功能边界

- Header 搜索框尚未接入查询行为，不要在没有需求时假设它已经可搜索。
- `mocks/handlers/speaking.handler.ts` 只有 Mock 接口，没有对应页面和正式 API 模块。
- `src/components/VirtualList/` 当前未被页面使用。
- 不要在文档或 UI 中把预留模块描述为已完成功能。

## 修改原则

- 保持改动聚焦，不进行无关重构或依赖升级。
- 工作区可能存在用户未提交改动；不要覆盖、还原或格式化无关文件。
- 不要修改 `public/favicon.ico`、Logo 等资源，除非任务明确要求。
- 不要手动修改构建产物 `dist/` 或依赖目录 `node_modules/`。
- 新增依赖前先确认现有依赖无法满足需求。
- 保持 `vite.config.ts` 与 `tsconfig*.json` 中的路径别名同步。
- 修改路由时同步更新 Header 导航、README 路由表和 404 行为。

## 完成检查

完成代码任务前确认：

1. 功能行为符合需求，未破坏现有路由和主题。
2. 新代码位于正确的架构层。
3. API 类型、Mock 数据和调用方保持一致。
4. 浅色与深色样式均使用设计变量。
5. 移动端布局不存在明显溢出。
6. `pnpm lint` 通过。
7. `pnpm build` 通过。
8. 文档在行为、命令或目录变化后已同步更新。
