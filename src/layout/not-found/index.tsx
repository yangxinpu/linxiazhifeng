import { ArrowLeftOutlined as ArrowLeft } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import styles from "./index.module.scss"

export default function NotFound() {
  return (
    <section className={styles.root}>
      <div className={styles.logoRow}>
        <svg viewBox="0 0 200 200" className={styles.logoSvg}>
          <defs>
            <linearGradient id="blueGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A90D9" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="greenGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0FD9A6" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
            </filter>
          </defs>

          <g className="logo-left" style={{ transformOrigin: '100px 100px' }}>
            <path
              d="M80 60 L120 50 L120 120 L90 140 L60 150 L70 80 Z"
              fill="url(#blueGradient1)"
              filter="url(#shadow1)"
            />
          </g>

          <g className="logo-right" style={{ transformOrigin: '100px 100px' }}>
            <path
              d="M140 80 L160 150 L130 160 L100 100 L130 70 Z"
              fill="url(#greenGradient1)"
              filter="url(#shadow1)"
            />
          </g>
        </svg>

        <svg viewBox="0 0 200 200" className={styles.logoSvg}>
          <defs>
            <linearGradient id="blueGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A90D9" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="greenGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0FD9A6" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
            </filter>
          </defs>

          <g className="logo-left-2" style={{ transformOrigin: '100px 100px' }}>
            <path
              d="M80 60 L120 50 L120 120 L90 140 L60 150 L70 80 Z"
              fill="url(#blueGradient2)"
              filter="url(#shadow2)"
            />
          </g>

          <g className="logo-right-2" style={{ transformOrigin: '100px 100px' }}>
            <path
              d="M140 80 L160 150 L130 160 L100 100 L130 70 Z"
              fill="url(#greenGradient2)"
              filter="url(#shadow2)"
            />
          </g>
        </svg>

        <svg viewBox="0 0 200 200" className={styles.logoSvg}>
          <defs>
            <linearGradient id="blueGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A90D9" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="greenGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0FD9A6" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
            </filter>
          </defs>

          <g className="logo-left-3" style={{ transformOrigin: '100px 100px' }}>
            <path
              d="M80 60 L120 50 L120 120 L90 140 L60 150 L70 80 Z"
              fill="url(#blueGradient3)"
              filter="url(#shadow3)"
            />
          </g>

          <g className="logo-right-3" style={{ transformOrigin: '100px 100px' }}>
            <path
              d="M140 80 L160 150 L130 160 L100 100 L130 70 Z"
              fill="url(#greenGradient3)"
              filter="url(#shadow3)"
            />
          </g>
        </svg>
      </div>

      <div className={styles.content}>
        <p className={styles.desc}>
          您寻找的页面似乎在森林中迷失了方向
        </p>

        <div className={styles.btnRow}>
          <Link
            to="/"
            className={`${styles.btn} group`}
          >
            <svg className={styles.btnSvg} viewBox="0 0 140 44" preserveAspectRatio="none">
              <defs>
                <linearGradient id="btnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A90D9" />
                  <stop offset="100%" stopColor="#0FD9A6" />
                </linearGradient>
                <filter id="btnShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#4A90D9" floodOpacity="0.3" />
                </filter>
              </defs>
              <rect
                x="1"
                y="1"
                width="138"
                height="42"
                rx="22"
                ry="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/30"
              />
              <rect
                x="1"
                y="1"
                width="138"
                height="42"
                rx="22"
                ry="22"
                fill="none"
                stroke="url(#btnGradient)"
                strokeWidth="1.5"
                className="btn-stroke"
                filter="url(#btnShadow)"
              />
            </svg>
            <span className={styles.btnContent}>
              <ArrowLeft style={{ fontSize: 16 }} />
              返回首页
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
