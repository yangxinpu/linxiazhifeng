import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppLoading } from '@/hooks'
import Loading from '@/layout/loading'
import NotFound from '@/layout/not-found'

const Main = lazy(() => import('@/layout/main/index'))
const Home = lazy(() => import('@/pages/home'))
const Quote = lazy(() => import('@/pages/quote'))
const QuoteDetail = lazy(() => import('@/pages/quote-detail'))
const Article = lazy(() => import('@/pages/article'))
const ArticleDetail = lazy(() => import('@/pages/article-detail'))

export default function App() {
  const { isLoading, hideLoading } = useAppLoading()

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
    <>
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
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}
