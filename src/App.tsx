import { Suspense, lazy, useEffect, useMemo } from 'react'
import { ConfigProvider, theme as antdTheme, type ThemeConfig } from 'antd'
import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppSkeleton } from '@/hooks'
import AppSkeleton from '@/layout/app-skeleton'
import NotFound from '@/layout/not-found'
import type { RootState } from '@/stores'

// 低饱和灰绿色减少浅色模式的纯白眩光，并与全局主题变量保持一致。
const LIGHT_THEME_TOKENS: NonNullable<ThemeConfig['token']> = {
  colorPrimary: '#087f65',
  colorInfo: '#2675ad',
  colorBgBase: '#edf2e8',
  colorBgLayout: '#edf2e8',
  colorBgContainer: '#f8faf5',
  colorBgElevated: '#fbfcf8',
  colorTextBase: '#1f2a24',
  colorText: '#1f2a24',
  colorTextSecondary: '#536058',
  colorBorder: '#ccd7ca',
  colorBorderSecondary: '#dce4d9',
  colorFill: '#dce6da',
  colorFillSecondary: '#e5ebe2',
  colorFillTertiary: '#e9efe6',
  colorFillQuaternary: '#f0f4ed',
}

const Main = lazy(() => import('@/layout/main/index'))
const Home = lazy(() => import('@/pages/home'))
const Quote = lazy(() => import('@/pages/quote'))
const QuoteDetail = lazy(() => import('@/pages/quote-detail'))
const Article = lazy(() => import('@/pages/article'))
const ArticleDetail = lazy(() => import('@/pages/article-detail'))
const Profile = lazy(() => import('@/pages/profile'))

export default function App() {
  const { isGlobalSkeletonVisible, hideGlobalSkeleton } = useAppSkeleton()
  const themeMode = useSelector((state: RootState) => state.appUi.theme)
  const antdThemeConfig = useMemo(() => ({
    algorithm: themeMode === 'dark'
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
    token: themeMode === 'dark' ? undefined : LIGHT_THEME_TOKENS,
  }), [themeMode])

  useEffect(() => {
    // 页面资源就绪后移除首屏骨架，避免内容布局尚未稳定时提前展示。
    if (document.readyState === 'complete') {
      hideGlobalSkeleton()
    } else {
      window.addEventListener('load', hideGlobalSkeleton)
      return () => window.removeEventListener('load', hideGlobalSkeleton)
    }
  }, [hideGlobalSkeleton])

  return (
    <ConfigProvider theme={antdThemeConfig}>
      {isGlobalSkeletonVisible && <AppSkeleton />}
      <BrowserRouter>
        <Suspense fallback={<AppSkeleton />}>
          <Routes>
            <Route path="/" element={<Main />}>
              <Route index element={<Home />} />
              <Route path="quotes" element={<Quote />} />
              <Route path="quote" element={<Quote />} />
              <Route path="quote/:id" element={<QuoteDetail />} />
              <Route path="articles" element={<Article />} />
              <Route path="article/:id" element={<ArticleDetail />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  )
}
