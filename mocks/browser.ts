import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// 开发期间同步热更新后的 Handler，避免新增接口仍使用旧路由表。
if (import.meta.hot) {
  import.meta.hot.accept('./handlers', (module) => {
    if (module) {
      worker.resetHandlers(...module.handlers)
    }
  })
}
