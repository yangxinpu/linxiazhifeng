import { createSlice } from '@reduxjs/toolkit'

export type ThemeMode = 'dark' | 'light'

interface AppStatusState {
  isLoading: boolean //全局页面加载状态 
  theme: ThemeMode //当前主题模式
}

const initialState: AppStatusState = {
  isLoading: true,
  theme: 'dark',
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

export const isLoadingSelector = (state: AppStatusState) => state.isLoading
export const themeSelector = (state: AppStatusState) => state.theme

export const { showLoading, hideLoading, setTheme } = appStatusSlice.actions