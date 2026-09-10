import { createSlice } from '@reduxjs/toolkit'

export type ThemeMode = 'dark' | 'light'

interface AppUiState {
  globalSkeletonRequestCount: number // 当前需要展示全局骨架屏的请求数量
  theme: ThemeMode // 当前主题模式
}

/** 使用首屏脚本已经设置的 DOM class 初始化主题，避免 Ant Design 闪烁。 */
function getInitialTheme(): ThemeMode {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light'
}

const initialState: AppUiState = {
  globalSkeletonRequestCount: 1,
  theme: getInitialTheme(),
}

export const appUiSlice = createSlice({
  name: 'appUi',
  initialState,
  reducers: {
    showGlobalSkeleton: (state) => {
      state.globalSkeletonRequestCount += 1
    },
    hideGlobalSkeleton: (state) => {
      state.globalSkeletonRequestCount = Math.max(
        0,
        state.globalSkeletonRequestCount - 1,
      )
    },
    setTheme: (state, action: { payload: ThemeMode }) => {
      state.theme = action.payload
    },
  },
})

export const { showGlobalSkeleton, hideGlobalSkeleton, setTheme } = appUiSlice.actions
