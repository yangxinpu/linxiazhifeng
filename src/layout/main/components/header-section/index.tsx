import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRightOutlined as ArrowRight,
  CloseOutlined as Close,
  DeleteOutlined as Delete,
  FileTextOutlined as FileText,
  FireOutlined as Fire,
  HistoryOutlined as History,
  HomeOutlined as Home,
  MenuOutlined as MenuIcon,
  MessageOutlined as Quote,
  SearchOutlined as Search,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Empty,
  Input,
  Layout,
  List,
  Menu,
  Spin,
  Tag,
  Tooltip,
  Typography,
  type InputRef,
  type MenuProps,
} from 'antd'
import { getSearchResults } from '@/api'
import type { SearchResult } from '@/api'
import logo from '@/assets/images/Linxiazhifeng.png'
import {
  DEFAULT_PROFILE_AVATAR_URL,
  PROFILE_AVATAR_UPDATED_EVENT,
} from '@/constants/profile-config'
import styles from './index.module.scss'

const { Header } = Layout
const { Text } = Typography

const SEARCH_HISTORY_STORAGE_KEY = 'Linxiazhifeng-search-history'
const SEARCH_HISTORY_LIMIT = 8
const SEARCH_RESULT_LIMIT = 8
const SEARCH_DEBOUNCE_MS = 180
const SEARCH_MAX_WIDTH = 620
const MOBILE_SEARCH_BREAKPOINT = 520
const SEARCH_MOTION_DURATION_MS = 240

interface SearchMotionStyle extends CSSProperties {
  '--search-origin-top': string
  '--search-start-offset-x': string
  '--search-start-scale-x': string
}

function readSearchHistory() {
  try {
    const storedValue: unknown = JSON.parse(
      localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY) ?? '[]',
    )

    if (!Array.isArray(storedValue)) return []

    return storedValue
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .slice(0, SEARCH_HISTORY_LIMIT)
  } catch {
    return []
  }
}

function persistSearchHistory(history: string[]) {
  localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(history))
}

function getResultPath(result: SearchResult) {
  return result.type === 'quote'
    ? `/quote/${result.id}`
    : `/article/${result.id}`
}

/** 管理 Header 搜索请求和本地搜索历史。 */
function useHeaderSearch(isEnabled: boolean) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [history, setHistory] = useState<string[]>(readSearchHistory)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEnabled) return

    const controller = new AbortController()
    const normalizedQuery = query.trim()
    const timer = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getSearchResults(
          {
            keyword: normalizedQuery || undefined,
            limit: SEARCH_RESULT_LIMIT,
          },
          controller.signal,
        )

        if (!controller.signal.aborted) {
          setResults(response.data)
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setResults([])
          setError(requestError instanceof Error ? requestError.message : '搜索失败')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, normalizedQuery ? SEARCH_DEBOUNCE_MS : 0)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [isEnabled, query])

  const commitSearch = useCallback((value: string) => {
    const normalizedValue = value.trim()
    if (!normalizedValue) return

    setHistory((currentHistory) => {
      const nextHistory = [
        normalizedValue,
        ...currentHistory.filter((item) => item !== normalizedValue),
      ].slice(0, SEARCH_HISTORY_LIMIT)

      persistSearchHistory(nextHistory)
      return nextHistory
    })
  }, [])

  const removeHistoryItem = useCallback((value: string) => {
    setHistory((currentHistory) => {
      const nextHistory = currentHistory.filter((item) => item !== value)
      persistSearchHistory(nextHistory)
      return nextHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY)
  }, [])

  const updateQuery = useCallback((value: string) => {
    setQuery(value)
    setIsLoading(isEnabled)
    setError(null)
  }, [isEnabled])

  const resetQuery = useCallback(() => {
    setQuery('')
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    query,
    setQuery: updateQuery,
    results,
    history,
    isLoading,
    error,
    commitSearch,
    removeHistoryItem,
    clearHistory,
    resetQuery,
  }
}

/** Header 搜索入口及居中搜索面板。 */
function HeaderSearch() {
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

const NAV_ITEMS = [
  { path: '/', matchPaths: ['/'], label: '首页', icon: Home },
  { path: '/quotes', matchPaths: ['/quotes', '/quote/'], label: '名言', icon: Quote },
  { path: '/articles', matchPaths: ['/articles', '/article/'], label: '文章', icon: FileText },
]

const MENU_ITEMS: MenuProps['items'] = NAV_ITEMS.map((item) => {
  const Icon = item.icon

  return {
    key: item.path,
    icon: <Icon />,
    label: <Link to={item.path}>{item.label}</Link>,
  }
})

/** 应用主导航栏。 */
export default function HeaderSection() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(DEFAULT_PROFILE_AVATAR_URL)
  const previousPathnameRef = useRef(location.pathname)
  const isProfileActive = location.pathname.startsWith('/profile')

  const activeMenuKey = NAV_ITEMS.find((item) => item.matchPaths.some((path) => (
    path === '/' ? location.pathname === path : location.pathname.startsWith(path)
  )))?.path

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) return

    previousPathnameRef.current = location.pathname
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleAvatarUpdated(event: Event) {
      if (event instanceof CustomEvent && typeof event.detail === 'string') {
        setProfileAvatarUrl(event.detail)
      }
    }

    window.addEventListener(PROFILE_AVATAR_UPDATED_EVENT, handleAvatarUpdated)
    return () => window.removeEventListener(PROFILE_AVATAR_UPDATED_EVENT, handleAvatarUpdated)
  }, [])

  return (
    <Header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.brandGroup}>
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="Linxiazhifeng Logo" className={styles.logoImg} />
            <span className={styles.logoText}>
              <span className={styles.logoTextPrimary}>Lin</span>
              <span>xia</span>
              <span className={styles.logoTextTertiary}>zhi</span>
              <span>feng</span>
            </span>
          </Link>
        </div>

        <div className={styles.headerRightGroup}>
          <HeaderSearch />
          <Menu
            mode="horizontal"
            items={MENU_ITEMS}
            selectedKeys={activeMenuKey ? [activeMenuKey] : []}
            className={styles.nav}
          />

          <div className={styles.headerRight}>
            <Button
              type="text"
              icon={isMobileMenuOpen ? <Close /> : <MenuIcon />}
              className={`${styles.iconButton} ${styles.mobileMenuBtn}`}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              aria-label="菜单"
              aria-expanded={isMobileMenuOpen}
            />

            <Tooltip title="打开个人主页" placement="bottomRight">
              <Link
                to="/profile"
                className={`${styles.profileLink} ${isProfileActive ? styles.profileLinkActive : ''}`}
                aria-label="打开个人主页"
              >
                <Avatar
                  size={38}
                  src={profileAvatarUrl}
                  alt="林知夏的头像"
                  className={styles.profileAvatar}
                >
                  林
                </Avatar>
              </Link>
            </Tooltip>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Menu
            mode="inline"
            items={MENU_ITEMS}
            selectedKeys={activeMenuKey ? [activeMenuKey] : []}
            className={styles.mobileMenuList}
          />
        </div>
      )}
    </Header>
  )
}
