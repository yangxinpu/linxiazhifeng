import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightOutlined as ArrowRight,
  CloseOutlined as Close,
  DeleteOutlined as Delete,
  FileTextOutlined as FileText,
  FireOutlined as Fire,
  HistoryOutlined as History,
  MessageOutlined as Quote,
  SearchOutlined as Search,
} from '@ant-design/icons'
import { Button, Empty, Input, List, Spin, Tag, Typography, type InputRef } from 'antd'
import { useHeaderSearch } from '../../hooks/use-header-search'
import type { SearchResult } from '@/api'
import styles from './index.module.scss'

const { Text } = Typography
const SEARCH_MAX_WIDTH = 620
const MOBILE_SEARCH_BREAKPOINT = 520
const SEARCH_MOTION_DURATION_MS = 240

interface SearchMotionStyle extends CSSProperties {
  '--search-origin-top': string
  '--search-start-offset-x': string
  '--search-start-scale-x': string
}

function getResultPath(result: SearchResult) {
  return result.type === 'quote'
    ? `/quote/${result.id}`
    : `/article/${result.id}`
}

/** Header 搜索入口及居中搜索面板。 */
export default function HeaderSearch() {
  const navigate = useNavigate()
  const inputRef = useRef<InputRef>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const openFrameRef = useRef<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchMotionStyle, setSearchMotionStyle] = useState<SearchMotionStyle>()
  const {
    query,
    setQuery,
    results,
    history,
    isLoading,
    error,
    commitSearch,
    removeHistoryItem,
    clearHistory,
    resetQuery,
  } = useHeaderSearch(isOpen)
  const hasQuery = query.trim().length > 0

  const completeClose = useCallback(() => {
    setIsOpen(false)
    setIsExpanded(false)
    resetQuery()
    closeTimerRef.current = null
  }, [resetQuery])

  const handleClose = useCallback(() => {
    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current)
      openFrameRef.current = null
    }

    setIsExpanded(false)

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }

    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (shouldReduceMotion) {
      completeClose()
      return
    }

    closeTimerRef.current = window.setTimeout(completeClose, SEARCH_MOTION_DURATION_MS)
  }, [completeClose])

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose, isOpen])

  useEffect(() => () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }
    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current)
    }
  }, [])

  function handleOpen() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    const triggerRect = triggerRef.current?.getBoundingClientRect()

    if (triggerRect) {
      const viewportWidth = window.innerWidth
      const layoutGutter = Math.min(48, Math.max(16, viewportWidth * 0.03))
      const horizontalMargin = viewportWidth <= MOBILE_SEARCH_BREAKPOINT
        ? 24
        : layoutGutter * 2
      const targetWidth = Math.min(SEARCH_MAX_WIDTH, viewportWidth - horizontalMargin)
      const targetLeft = (viewportWidth - targetWidth) / 2

      setSearchMotionStyle({
        '--search-origin-top': `${triggerRect.top}px`,
        '--search-start-offset-x': `${triggerRect.left - targetLeft}px`,
        '--search-start-scale-x': `${triggerRect.width / targetWidth}`,
      })
    }

    setIsOpen(true)
    setIsExpanded(false)
    openFrameRef.current = window.requestAnimationFrame(() => {
      openFrameRef.current = window.requestAnimationFrame(() => {
        setIsExpanded(true)
        openFrameRef.current = null
      })
    })
  }

  function handleSubmit() {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return

    commitSearch(normalizedQuery)

    const firstResult = isLoading ? undefined : results[0]
    if (firstResult) {
      navigate(getResultPath(firstResult))
      handleClose()
    }
  }

  function handleHistorySelected(value: string) {
    setQuery(value)
    inputRef.current?.focus()
  }

  function handleResultSelected() {
    commitSearch(query)
    handleClose()
  }

  return (
    <div className={styles.searchRoot}>
      <Button
        ref={triggerRef}
        type="text"
        icon={<Search />}
        className={`${styles.searchTrigger} ${isOpen ? styles.searchTriggerHidden : ''}`}
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={isExpanded}
      >
        <span className={styles.searchTriggerText}>搜索内容</span>
      </Button>

      {isOpen && createPortal(
        <>
          <button
            type="button"
            className={styles.searchBackdrop}
            onClick={handleClose}
            aria-label="关闭搜索"
          />

          <div
            className={`${styles.searchOverlay} ${isExpanded ? styles.searchOverlayExpanded : ''}`}
            style={searchMotionStyle}
            role="dialog"
            aria-modal="true"
            aria-label="搜索名言和文章"
          >
            <div className={styles.searchInputRow}>
              <Input
                ref={inputRef}
                autoFocus
                allowClear
                value={query}
                prefix={<Search className={styles.searchInputIcon} />}
                placeholder="搜索名言、作者或文章"
                className={styles.searchInput}
                onChange={(event) => setQuery(event.target.value)}
                onPressEnter={handleSubmit}
              />
              <Button
                type="text"
                icon={<Close />}
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="关闭搜索"
              />
            </div>

            <div className={styles.searchPanel} aria-live="polite">
              {!hasQuery && history.length > 0 && (
                <section className={styles.historySection} aria-labelledby="search-history-title">
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle} id="search-history-title">
                      <History />
                      <span>搜索历史</span>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      icon={<Delete />}
                      className={styles.clearHistoryButton}
                      onClick={clearHistory}
                    >
                      清空
                    </Button>
                  </div>

                  <div className={styles.historyList}>
                    {history.map((item) => (
                      <div className={styles.historyItem} key={item}>
                        <button
                          type="button"
                          className={styles.historyValue}
                          onClick={() => handleHistorySelected(item)}
                        >
                          {item}
                        </button>
                        <button
                          type="button"
                          className={styles.removeHistoryButton}
                          onClick={() => removeHistoryItem(item)}
                          aria-label={`删除搜索记录：${item}`}
                        >
                          <Close />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section aria-labelledby="search-results-title">
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle} id="search-results-title">
                    {hasQuery ? <Search /> : <Fire />}
                    <span>{hasQuery ? '匹配结果' : '推荐内容'}</span>
                  </div>
                  {!isLoading && !error && (
                    <Text className={styles.resultCount}>{results.length} 条</Text>
                  )}
                </div>

                {isLoading ? (
                  <div className={styles.searchState}>
                    <Spin size="small" />
                  </div>
                ) : error ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={error}
                    className={styles.searchState}
                  />
                ) : results.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="没有找到相关内容"
                    className={styles.searchState}
                  />
                ) : (
                  <List
                    split={false}
                    dataSource={results}
                    className={styles.resultList}
                    renderItem={(result) => (
                      <List.Item className={styles.resultListItem}>
                        <Link
                          to={getResultPath(result)}
                          className={styles.resultLink}
                          onClick={handleResultSelected}
                        >
                          <span className={styles.resultIcon} aria-hidden="true">
                            {result.type === 'quote' ? <Quote /> : <FileText />}
                          </span>
                          <span className={styles.resultContent}>
                            <span className={styles.resultTitle}>{result.title}</span>
                            <span className={styles.resultMeta}>
                              <Tag bordered={false} className={styles.resultType}>
                                {result.type === 'quote' ? '名言' : '文章'}
                              </Tag>
                              <span>{result.author}</span>
                              <span className={styles.resultExcerpt}>{result.excerpt}</span>
                            </span>
                          </span>
                          <ArrowRight className={styles.resultArrow} />
                        </Link>
                      </List.Item>
                    )}
                  />
                )}
              </section>
            </div>
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}
