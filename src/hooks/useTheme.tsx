import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch } from '@/stores/index'
import { setTheme as setThemeAction, themeSelector } from '@/stores/slices/app-status-slice'

/**
 * 主题管理 Hook
 * - 自动初始化：优先 localStorage → 系统偏好 → 默认 dark
 * - 自动同步：theme 变化时更新 html 类名 + localStorage
 * - 返回 { theme, resolved, setTheme, toggleTheme }
 */
export function useTheme() {
  const theme = useSelector(themeSelector)
  const dispatch = useDispatch<AppDispatch>()

  // 初始化：读取本地存储 / 系统偏好
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial: 'dark' | 'light' = saved ?? (prefersDark ? 'dark' : 'light')
    dispatch(setThemeAction(initial))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 同步到 DOM + localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return {
    theme,
    resolved: theme,
    setTheme: (t: 'dark' | 'light') => dispatch(setThemeAction(t)),
    toggleTheme: () => dispatch(setThemeAction(theme === 'dark' ? 'light' : 'dark')),
  }
}
