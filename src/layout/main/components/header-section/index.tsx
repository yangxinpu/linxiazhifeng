import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  CloseOutlined as Close,
  FileTextOutlined as FileText,
  HomeOutlined as Home,
  MenuOutlined as MenuIcon,
  MessageOutlined as Quote,
} from '@ant-design/icons'
import { Avatar, Button, Layout, Menu, Tooltip, type MenuProps } from 'antd'
import logo from '@/assets/images/logo.png'
import {
  DEFAULT_PROFILE_AVATAR_URL,
  PROFILE_AVATAR_UPDATED_EVENT,
} from '@/constants/profile-config'
import HeaderSearch from './components/header-search'
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
