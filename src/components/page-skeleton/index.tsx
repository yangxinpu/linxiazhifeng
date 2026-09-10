import { Skeleton } from 'antd'
import styles from './index.module.scss'

const LIST_SKELETON_ROWS = ['first', 'second', 'third']

interface PageSkeletonProps {
  variant?: 'list' | 'detail'
}

/** 页面内容区使用的局部骨架屏，不遮挡 Header 与 Footer。 */
export default function PageSkeleton({
  variant = 'list',
}: PageSkeletonProps) {
  return (
    <section
      className={styles.page}
      role="status"
      aria-busy="true"
      aria-label="页面内容加载中"
    >
      <div className={styles.container}>
        {variant === 'detail' ? (
          <>
            <Skeleton.Button active size="small" className={styles.backButton} />
            <div className={styles.detail}>
              <Skeleton
                active
                title={{ width: '62%' }}
                paragraph={{ rows: 8, width: ['42%', '100%', '88%', '96%', '91%', '78%', '94%', '58%'] }}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.intro}>
              <Skeleton.Input active size="large" className={styles.heading} />
              <Skeleton
                active
                title={false}
                paragraph={{ rows: 2, width: ['88%', '64%'] }}
              />
            </div>
            <div className={styles.list}>
              {LIST_SKELETON_ROWS.map((row) => (
                <div className={styles.listItem} key={row}>
                  <Skeleton.Avatar active size={72} shape="square" />
                  <Skeleton
                    active
                    title={{ width: '42%' }}
                    paragraph={{ rows: 2, width: ['94%', '68%'] }}
                    className={styles.listItemContent}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
