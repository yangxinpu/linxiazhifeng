import { configureStore } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { appStatusSlice, showLoading, hideLoading } from './slices/app-status-slice'

/* ---------- Store ---------- */
export const store = configureStore({
  reducer: {
    appStatus: appStatusSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

/* ---------- Hooks ---------- */

/** 全局 loading + 主题控制 Hook */
export function useAppStore() {
  const isLoading = useSelector((state: RootState) => state.appStatus.isLoading)
  const dispatch = useDispatch<AppDispatch>()

  return {
    isLoading,
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading()),
  }
}

/** Provider */
export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
