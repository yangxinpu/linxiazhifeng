import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  CloseOutlined as Close,
  FileTextOutlined as FileText,
  HomeOutlined as Home,
  MenuOutlined as MenuIcon,
  MessageOutlined as Quote,
  MoonOutlined as Moon,
  SearchOutlined as Search,
  SunOutlined as Sun,
} from '@ant-design/icons'
import { Button, Input, Layout, Menu, type MenuProps } from 'antd'
import { useTheme } from '@/hooks'
import logo from '@/assets/images/logo.png'
import styles from './index.module.scss'

const { Header } = Layout

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
  const { resolved, toggleTheme } = useTheme()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const previousPathnameRef = useRef(location.pathname)

  const activeMenuKey = NAV_ITEMS.find((item) => item.matchPaths.some((path) => (
    path === '/' ? location.pathname === path : location.pathname.startsWith(path)
  )))?.path

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) return

    previousPathnameRef.current = location.pathname
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <Header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={`${styles.logoLink} ${isSearchFocused ? styles.logoLinkHidden : ''}`}>
          <img src={logo} alt="GroveGrace Logo" className={styles.logoImg} />
          <span className={styles.logoText}>GroveGrace</span>
        </Link>

        <div className={`${styles.headerCenter} ${isSearchFocused ? styles.headerCenterFocused : ''}`}>
          <Menu
            mode="horizontal"
            items={MENU_ITEMS}
            selectedKeys={activeMenuKey ? [activeMenuKey] : []}
            className={`${styles.nav} ${isSearchFocused ? styles.navHidden : ''}`}
          />

          <Input
            allowClear
            prefix={<Search className={styles.searchIcon} />}
            placeholder="搜索..."
            aria-label="搜索内容"
            className={`${styles.searchBox} ${isSearchFocused ? styles.searchBoxFocused : ''}`}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />

          <div className={`${styles.headerRight} ${isSearchFocused ? styles.headerRightHidden : ''}`}>
            <Button
              type="text"
              icon={resolved === 'dark' ? <Sun /> : <Moon />}
              onClick={toggleTheme}
              className={styles.iconButton}
              aria-label="切换主题"
              title="切换主题"
            />

            <Button
              type="text"
              icon={isMobileMenuOpen ? <Close /> : <MenuIcon />}
              className={`${styles.iconButton} ${styles.mobileMenuBtn}`}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              aria-label="菜单"
              aria-expanded={isMobileMenuOpen}
            />
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
