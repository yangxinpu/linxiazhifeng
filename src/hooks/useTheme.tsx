import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/stores'
import { setTheme as setThemeAction, type ThemeMode } from '@/stores/slices/app-ui-slice'

const THEME_STORAGE_KEY = 'linxiazhifeng-theme'

/** 判断本地存储值是否为有效主题。 */
function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'dark' || value === 'light'
}

/**
 * 主题管理 Hook
 * - 自动初始化：优先 localStorage → 系统偏好 → 默认 dark
 * - 自动同步：theme 变化时更新 html 类名 + localStorage
 * - 返回 { theme, resolved, setTheme, toggleTheme }
 */
export function useTheme() {
  const theme = useSelector((state: RootState) => state.appUi.theme)
  const dispatch = useDispatch<AppDispatch>()

  /** 设置当前主题。 */
  const setTheme = useCallback((nextTheme: ThemeMode) => {
    dispatch(setThemeAction(nextTheme))
  }, [dispatch])

  /** 在深色与浅色主题之间切换。 */
  const toggleTheme = useCallback(() => {
    dispatch(setThemeAction(theme === 'dark' ? 'light' : 'dark'))
  }, [dispatch, theme])

  // 首次挂载时恢复用户主题偏好。
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = isThemeMode(savedTheme)
      ? savedTheme
      : prefersDark ? 'dark' : 'light'

    dispatch(setThemeAction(initialTheme))
  }, [dispatch])

  // 保持 DOM 主题和持久化值与 Redux 状态一致。
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return {
    theme,
    resolved: theme,
    setTheme,
    toggleTheme,
  }
}
