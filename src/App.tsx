import { Suspense, lazy, useEffect, useMemo } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppLoading } from '@/hooks'
import Loading from '@/layout/loading'
import NotFound from '@/layout/not-found'
import type { RootState } from '@/stores'

const Main = lazy(() => import('@/layout/main/index'))
const Home = lazy(() => import('@/pages/home'))
const Quote = lazy(() => import('@/pages/quote'))
const QuoteDetail = lazy(() => import('@/pages/quote-detail'))
const Article = lazy(() => import('@/pages/article'))
const ArticleDetail = lazy(() => import('@/pages/article-detail'))
const Profile = lazy(() => import('@/pages/profile'))

export default function App() {
  const { isLoading, hideLoading } = useAppLoading()
  const themeMode = useSelector((state: RootState) => state.appStatus.theme)
  const antdThemeConfig = useMemo(() => ({
    algorithm: themeMode === 'dark'
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
  }), [themeMode])

  useEffect(() => {
    // 页面加载完成后隐藏加载动画
    if (document.readyState === 'complete') {
      hideLoading()
    } else {
      // 页面未加载完成，监听 load 事件
      window.addEventListener('load', hideLoading)
      return () => window.removeEventListener('load', hideLoading)
    }
  }, [hideLoading])

  return (
    <ConfigProvider theme={antdThemeConfig}>
      {isLoading && <Loading />}
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
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
