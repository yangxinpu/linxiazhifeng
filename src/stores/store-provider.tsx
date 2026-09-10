import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

/** 向组件树注入应用级 Redux store。 */
export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
