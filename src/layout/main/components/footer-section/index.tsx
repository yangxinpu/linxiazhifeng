import { Layout } from 'antd'
import styles from './index.module.scss'

const { Footer } = Layout

/** 应用页脚。 */
export default function FooterSection() {
  return (
    <Footer className={styles.footer}>
      © {new Date().getFullYear()} Linxiazhifeng
    </Footer>
  )
}
