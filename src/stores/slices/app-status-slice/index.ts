import { createSlice } from '@reduxjs/toolkit'

export type ThemeMode = 'dark' | 'light'

interface AppStatusState {
  isLoading: boolean // 全局页面加载状态
  theme: ThemeMode // 当前主题模式
}

/** 使用首屏脚本已经设置的 DOM class 初始化主题，避免 Ant Design 闪烁。 */
function getInitialTheme(): ThemeMode {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light'
}

const initialState: AppStatusState = {
  isLoading: true,
  theme: getInitialTheme(),
}

export const appStatusSlice = createSlice({
  name: 'appStatus',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true
    },
    hideLoading: (state) => {
      state.isLoading = false
    },
    setTheme: (state, action: { payload: ThemeMode }) => {
      state.theme = action.payload
    },
  },
})

export const { showLoading, hideLoading, setTheme } = appStatusSlice.actions
