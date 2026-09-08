import { useState, useRef, useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { Moon, Sun, Menu, X, Search, Home, Quote, FileText, Info, Mic } from "lucide-react"
import { useTheme } from "@/stores/useTheme"
import logo from "@/assets/images/logo.png"

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
    { path: "/ai-speaking", label: "AI口语", icon: Mic },
    { path: "/about", label: "关于", icon: Info },
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${searchFocused ? "transition-opacity duration-300 opacity-0 pointer-events-none" : "opacity-100"}`}>
            <img src={logo} alt="GroveGrace Logo" className="h-8 w-8 object-contain" />
            <span 
              className="hidden sm:inline text-xl font-serif font-bold tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #0fd9a6 0%, #2b8ae0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              GroveGrace
            </span>
          </Link>

          <div className={`flex items-center gap-3 ${searchFocused ? "transition-all duration-500 ease-in-out absolute inset-x-0 mx-auto w-full max-w-md justify-center px-6" : ""}`}>
            <nav ref={navRef} className={`hidden md:flex items-center gap-1 relative ${searchFocused ? "transition-all duration-500 ease-in-out opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100"}`}>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    data-path={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:text-primary ${
                      location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                )
              })}
              <div
                className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
            </nav>

            <div className={`flex items-center gap-2 px-2.5 py-1 rounded border ${searchFocused ? "transition-all duration-500 ease-in-out border-primary/40 ring-1 ring-primary/15 w-full shadow-md shadow-primary/5" : "bg-muted/50 border-border/50"}`}>
              <Search className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-300 ${searchFocused ? "scale-110" : ""}`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="搜索..."
                className="bg-transparent border-none outline-none text-xs placeholder:text-muted-foreground/60 w-full"
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
                  className="shrink-0 p-0.5 rounded hover:bg-accent transition-all duration-200 hover:rotate-90"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className={`flex items-center gap-3 ${searchFocused ? "transition-all duration-500 ease-in-out opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100"}`}>
              <button
                onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
                className="p-1.5 rounded-full hover:bg-accent transition-colors"
                aria-label="切换主题"
              >
                {resolved === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              <button
                className="md:hidden p-1.5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="菜单"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-accent ${
                      location.pathname === item.path ? "text-primary bg-primary/10" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GroveGrace
      </footer>
    </div>
  )
}
