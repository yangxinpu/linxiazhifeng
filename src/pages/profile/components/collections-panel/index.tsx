import { Link } from 'react-router-dom'
import { BookOutlined, HeartOutlined, RightOutlined } from '@ant-design/icons'
import { Card, List, Progress, Space, Tag, Typography } from 'antd'
import type { UserProfile } from '@/api'
import { formatDate } from '@/utils'
import styles from './index.module.scss'

const { Paragraph, Text, Title } = Typography

interface CollectionsPanelProps {
  profile: UserProfile
}

/** 展示收藏名言和最近阅读足迹。 */
export default function CollectionsPanel({ profile }: CollectionsPanelProps) {
  return (
    <div className={styles.collectionGrid}>
      <Card
        title={(
          <Space>
            <HeartOutlined />
            收藏摘录
          </Space>
        )}
        className={styles.panelCard}
      >
        <List
          dataSource={profile.favoriteQuotes}
          renderItem={(quote) => (
            <List.Item
              className={styles.quoteListItem}
              actions={[
                <Link key="detail" to={`/quote/${quote.id}`} aria-label={`查看${quote.author}的名言`}>
                  <RightOutlined />
                </Link>,
              ]}
            >
              <div>
                <Paragraph className={styles.favoriteQuote}>“{quote.content}”</Paragraph>
                <Space size={8} wrap>
                  <Text className={styles.quoteAuthor}>{quote.author}</Text>
                  <Text className={styles.mutedText}>《{quote.source}》</Text>
                  <Text className={styles.mutedText}>{formatDate(quote.collectedAt)} 收藏</Text>
                </Space>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card
        title={(
          <Space>
            <BookOutlined />
            最近阅读
          </Space>
        )}
        className={styles.panelCard}
      >
        <List
          dataSource={profile.recentArticles}
          renderItem={(article) => (
            <List.Item className={styles.articleListItem}>
              <div className={styles.recentArticle}>
                <div className={styles.recentArticleHeader}>
                  <div>
                    <Link to={`/article/${article.id}`}>
                      <Title level={4} className={styles.recentArticleTitle}>
                        {article.title}
                      </Title>
                    </Link>
                    <Space size={8} wrap>
                      <Text className={styles.mutedText}>{article.author}</Text>
                      <Tag className={styles.categoryTag}>{article.category}</Tag>
                      <Text className={styles.mutedText}>{formatDate(article.readAt)}</Text>
                    </Space>
                  </div>
                  <Text className={styles.readPercent}>{article.readProgress}%</Text>
                </div>
                <Progress
                  percent={article.readProgress}
                  showInfo={false}
                  strokeColor="var(--primary)"
                  trailColor="var(--muted)"
                  size="small"
                />
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}
