import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import PageSkeleton from '@/components/page-skeleton'
import FooterSection from './components/footer-section'
import HeaderSection from './components/header-section'
import styles from './index.module.scss'

const { Content } = Layout

/** 应用主布局。 */
export default function Main() {
  return (
    <Layout className={styles.appRoot}>
      <HeaderSection />

      <Content className={styles.main}>
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </Content>

      <FooterSection />
    </Layout>
  )
}
