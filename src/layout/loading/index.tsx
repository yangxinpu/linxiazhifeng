import logo from "@/assets/images/logo.png"
import styles from "./index.module.scss"

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.spinnerWrapper}>
          <img
            src={logo}
            alt="GroveGrace Logo"
            className={styles.logoImg}
          />

          <svg
            className={styles.spinnerSvg}
            style={{ animationDuration: '2s', animationTimingFunction: 'ease-in-out' }}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                strokeDasharray: '283',
                strokeDashoffset: '0',
                animation: 'loading-circle 2s ease-in-out infinite',
              }}
            />
          </svg>
        </div>

        <div className="text-center">
          <h1
            className={styles.title}
          >
            Linxiazhifeng
          </h1>
        </div>
      </div>
    </div>
  )
}
