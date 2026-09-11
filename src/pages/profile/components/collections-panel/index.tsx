import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOutlined,
  EditOutlined,
  LoadingOutlined,
  RightOutlined,
  StarOutlined,
} from '@ant-design/icons'
import { Button, Card, List, Progress, Space, Tag, Typography } from 'antd'
import type { UserProfile } from '@/api'
import { formatDate } from '@/utils'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import {
  contentThemeCategories,
  getCategoryLabel,
} from '@/constants/article-category'
import styles from './index.module.scss'

const { Paragraph, Text, Title } = Typography

const PAGE_SIZE = 5

interface CollectionsPanelProps {
  profile: UserProfile
  /** 删除后同步列表到后端。 */
  onCollectionsChange: (
    payload: {
      favoriteQuotes?: UserProfile['favoriteQuotes']
      recentArticles?: UserProfile['recentArticles']
    },
  ) => Promise<unknown>
}

/** 收藏摘录卡片。 */
function FavoriteQuoteList({
  quotes,
  editing,
  editingIds,
  onToggleEditing,
  onToggleMark,
  onConfirm,
  loading,
  observerRef,
  hasMore,
  isLoadingMore,
}: {
  quotes: UserProfile['favoriteQuotes']
  editing: boolean
  editingIds: Set<number>
  onToggleEditing: () => void
  onToggleMark: (id: number) => void
  onConfirm: () => Promise<void>
  loading: boolean
  observerRef: React.RefObject<HTMLDivElement | null>
  hasMore: boolean
  isLoadingMore: boolean
}) {
  return (
    <Card
      title={(
        <Space>
          <StarOutlined />
          收藏摘录
        </Space>
      )}
      extra={(
        <Space size={6}>
          {editing && (
            <>
              <Button
                type="primary"
                danger
                size="small"
                disabled={editingIds.size === 0}
                onClick={onConfirm}
              >
                删除 {editingIds.size} 条
              </Button>
              <Button type="text" size="small" onClick={onToggleEditing}>
                取消
              </Button>
            </>
          )}
          {!editing && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={onToggleEditing}
            >
              编辑
            </Button>
          )}
        </Space>
      )}
      className={styles.panelCard}
    >
      {loading ? (
        <div className={styles.listLoading}>
          <LoadingOutlined />
        </div>
      ) : (
        <>
          <List
            dataSource={quotes}
            renderItem={(quote) => {
              const marked = editingIds.has(quote.id)
              return (
                <List.Item
                  className={`${styles.quoteListItem} ${marked ? styles.quoteItemMarked : ''}`}
                  actions={editing
                    ? [
                        <Button
                          key="mark"
                          type={marked ? 'text' : 'primary'}
                          variant={!marked ? 'dashed' : undefined}
                          danger={!marked}
                          size="small"
                          onClick={() => onToggleMark(quote.id)}
                        >
                          {marked ? '取消' : '删除'}
                        </Button>,
                      ]
                    : [
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
              )
            }}
          />
          {isLoadingMore && (
            <div className={styles.listLoading}>
              <LoadingOutlined /> 加载中...
            </div>
          )}
          {!hasMore && quotes.length > 0 && (
            <div className={styles.listEnd}>已经到底啦~</div>
          )}
          <div ref={observerRef} />
        </>
      )}
    </Card>
  )
}

/** 最近阅读卡片。 */
function RecentArticleList({
  articles,
  loading,
  observerRef,
  hasMore,
  isLoadingMore,
}: {
  articles: UserProfile['recentArticles']
  loading: boolean
  observerRef: React.RefObject<HTMLDivElement | null>
  hasMore: boolean
  isLoadingMore: boolean
}) {
  return (
    <Card
      title={(
        <Space>
          <BookOutlined />
          最近阅读
        </Space>
      )}
      className={styles.panelCard}
    >
      {loading ? (
        <div className={styles.listLoading}>
          <LoadingOutlined />
        </div>
      ) : (
        <>
          <List
            dataSource={articles}
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
                        <Tag className={styles.categoryTag}>
                          {getCategoryLabel(contentThemeCategories, article.contentTheme)}
                        </Tag>
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
          {isLoadingMore && (
            <div className={styles.listLoading}>
              <LoadingOutlined /> 加载中...
            </div>
          )}
          {!hasMore && articles.length > 0 && (
            <div className={styles.listEnd}>已经到底啦~</div>
          )}
          <div ref={observerRef} />
        </>
      )}
    </Card>
  )
}

/** 展示收藏名言和最近阅读足迹。 */
export default function CollectionsPanel({ profile, onCollectionsChange }: CollectionsPanelProps) {
  // 收藏摘录：编辑状态
  const [quoteEditing, setQuoteEditing] = useState(false)
  const [quoteEditingIds, setQuoteEditingIds] = useState<Set<number>>(new Set())
  const [quoteDeleting, setQuoteDeleting] = useState(false)

  // 收藏摘录：无限滚动
  const [quotePage, setQuotePage] = useState(1)
  const quoteSource = useMemo(() => {
    if (!quoteEditing) return profile.favoriteQuotes
    const removing = quoteEditingIds
    return profile.favoriteQuotes.filter((q) => !removing.has(q.id))
  }, [profile.favoriteQuotes, quoteEditing, quoteEditingIds])
  const visibleQuotes = useMemo(() => quoteSource.slice(0, quotePage * PAGE_SIZE), [quoteSource, quotePage])
  const quoteHasMore = visibleQuotes.length < quoteSource.length
  const { observerRef: quoteObserverRef, isLoading: quoteLoadingMore } = useInfiniteScroll({
    hasMore: quoteHasMore,
    onLoadMore: useCallback(() => setQuotePage((p) => p + 1), []),
  })

  // 最近阅读：无限滚动
  const [articlePage, setArticlePage] = useState(1)
  const visibleArticles = useMemo(
    () => profile.recentArticles.slice(0, articlePage * PAGE_SIZE),
    [profile.recentArticles, articlePage],
  )
  const articleHasMore = visibleArticles.length < profile.recentArticles.length
  const { observerRef: articleObserverRef, isLoading: articleLoadingMore } = useInfiniteScroll({
    hasMore: articleHasMore,
    onLoadMore: useCallback(() => setArticlePage((p) => p + 1), []),
  })

  const toggleQuoteEdit = useCallback(() => {
    setQuoteEditing((current) => {
      if (!current) {
        setQuoteEditingIds(new Set())
        return true
      }
      // 退出编辑态时，若有 pending 删除则自动丢弃（需点"删除 X 条"按钮才会提交）
      setQuoteEditingIds(new Set())
      return false
    })
  }, [])

  const toggleQuoteMark = useCallback((id: number) => {
    setQuoteEditingIds((ids) => {
      const next = new Set(ids)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const confirmQuoteDeletes = useCallback(async () => {
    if (quoteEditingIds.size === 0) return
    setQuoteDeleting(true)
    try {
      const remaining = profile.favoriteQuotes.filter((q) => !quoteEditingIds.has(q.id))
      await onCollectionsChange({ favoriteQuotes: remaining })
      setQuoteEditing(false)
      setQuoteEditingIds(new Set())
      setQuotePage(1)
    } finally {
      setQuoteDeleting(false)
    }
  }, [quoteEditingIds, profile.favoriteQuotes, onCollectionsChange])

  return (
    <div className={styles.collectionGrid}>
      <FavoriteQuoteList
        quotes={visibleQuotes}
        editing={quoteEditing}
        editingIds={quoteEditingIds}
        onToggleEditing={toggleQuoteEdit}
        onToggleMark={toggleQuoteMark}
        onConfirm={confirmQuoteDeletes}
        loading={quoteDeleting}
        observerRef={quoteObserverRef}
        hasMore={quoteHasMore}
        isLoadingMore={quoteLoadingMore}
      />

      <RecentArticleList
        articles={visibleArticles}
        loading={false}
        observerRef={articleObserverRef}
        hasMore={articleHasMore}
        isLoadingMore={articleLoadingMore}
      />
    </div>
  )
}
