import { Skeleton } from 'antd'
import styles from './index.module.scss'

const SKELETON_ROWS = ['primary', 'secondary', 'tertiary']

/** 应用启动与主布局懒加载使用的全局静态骨架屏。 */
export default function AppSkeleton() {
  return (
    <div
      className={styles.wrapper}
      role="status"
      aria-busy="true"
      aria-label="页面内容加载中"
    >
      <header className={styles.header}>
        <div className={styles.brand}>
          <Skeleton.Avatar size={32} shape="square" />
          <Skeleton.Input size="small" className={styles.brandName} />
        </div>

        <div className={styles.actions}>
          <Skeleton.Input size="small" className={styles.search} />
          <div className={styles.navigation} aria-hidden="true">
            {SKELETON_ROWS.map((row) => (
              <Skeleton.Input key={row} size="small" className={styles.navigationItem} />
            ))}
          </div>
          <Skeleton.Avatar size={38} />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.intro} aria-hidden="true">
          <Skeleton.Input size="large" className={styles.heading} />
          <Skeleton
            title={false}
            paragraph={{ rows: 2, width: ['88%', '64%'] }}
            className={styles.introText}
          />
        </section>

        <section className={styles.content} aria-hidden="true">
          {SKELETON_ROWS.map((row) => (
            <div className={styles.contentRow} key={row}>
              <Skeleton.Avatar size={72} shape="square" />
              <Skeleton
                title={{ width: '42%' }}
                paragraph={{ rows: 2, width: ['94%', '68%'] }}
                className={styles.contentText}
              />
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
