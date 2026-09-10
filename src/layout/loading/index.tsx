import logo from '@/assets/images/logo.png'
import styles from './index.module.scss'

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
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              className={styles.spinnerCircle}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className={styles.textContainer}>
          <p className={styles.title}>GroveGrace</p>
        </div>
      </div>
    </div>
  )
}
