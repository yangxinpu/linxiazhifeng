import { useState, useRef, useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { MoonOutlined as Moon, SunOutlined as Sun, MenuOutlined as Menu, CloseOutlined as X, SearchOutlined as Search, HomeOutlined as Home, MessageOutlined as Quote, FileTextOutlined as FileText, InfoCircleOutlined as Info, AudioOutlined as Mic } from "@ant-design/icons"
import { useTheme } from "@/hooks/useTheme"
import logo from "@/assets/images/logo.png"
import styles from "./index.module.scss"

export default function Main() {
  const { setTheme, resolved } = useTheme()
  const location = useLocation()
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 }) // 导航指示器位置
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // 移动端菜单开关
  const [searchFocused, setSearchFocused] = useState(false) // 搜索框聚焦状态
  const navRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const prevPathname = useRef(location.pathname)

  const navItems = [
    { path: "/", label: "首页", icon: Home },
    { path: "/quotes", label: "名言", icon: Quote },
    { path: "/articles", label: "文章", icon: FileText },
  ]

  useEffect(() => {
    if (navRef.current && !searchFocused) {
      const activeLink = navRef.current.querySelector(`[data-path="${location.pathname}"]`)
      if (activeLink) {
        const rect = activeLink.getBoundingClientRect()
        const navRect = navRef.current.getBoundingClientRect()
        setIndicatorStyle({
          left: rect.left - navRect.left,
          width: rect.width,
        })
      }
    }
  }, [location.pathname, searchFocused])

  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname
      setMobileMenuOpen(false)
    }
  }, [location.pathname])

  return (
    <div className={styles.appRoot}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={`${styles.logoLink} ${searchFocused ? styles.logoLinkHidden : ""}`}>
            <img src={logo} alt="GroveGrace Logo" className={styles.logoImg} />
            <span className={styles.logoText}>
              GroveGrace
            </span>
          </Link>

          <div className={`${styles.headerCenter} ${searchFocused ? styles.headerCenterFocused : ""}`}>
            <nav ref={navRef} className={`${styles.nav} ${searchFocused ? styles.navHidden : ""}`}>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    data-path={item.path}
                    className={`${styles.navLink} ${location.pathname === item.path ? styles.navLinkActive : ""}`}
                  >
                    <Icon style={{ fontSize: 14 }} />
                    {item.label}
                  </Link>
                )
              })}
              <div
                className={styles.navIndicator}
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
            </nav>

            <div className={`${styles.searchBox} ${searchFocused ? styles.searchBoxFocused : ""}`}>
              <Search className={`${styles.searchIcon} ${searchFocused ? styles.searchIconScaled : ""}`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="搜索..."
                className={styles.searchInput}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {searchFocused && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setSearchFocused(false)
                    if (searchInputRef.current) {
                      searchInputRef.current.blur()
                    }
                  }}
                  className={styles.searchCloseBtn}
                >
                  <X className={styles.searchCloseIcon} />
                </button>
              )}
            </div>

            <div className={`${styles.headerRight} ${searchFocused ? styles.headerRightHidden : ""}`}>
              <button
                onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
                className={styles.themeBtn}
                aria-label="切换主题"
              >
                {resolved === "dark" ? (
                  <Sun style={{ fontSize: 16 }} />
                ) : (
                  <Moon style={{ fontSize: 16 }} />
                )}
              </button>

              <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="菜单"
              >
                {mobileMenuOpen ? <X style={{ fontSize: 20 }} /> : <Menu style={{ fontSize: 20 }} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuInner}>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${styles.mobileNavLink} ${location.pathname === item.path ? styles.mobileNavLinkActive : ""}`}
                  >
                    <Icon style={{ fontSize: 16 }} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} GroveGrace
      </footer>
    </div>
  )
}
