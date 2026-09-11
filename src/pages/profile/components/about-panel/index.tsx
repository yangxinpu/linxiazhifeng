import { MailOutlined, ProjectOutlined, ReadOutlined } from '@ant-design/icons'
import { Card, Divider, Typography } from 'antd'
import {
  BRAND_HIGHLIGHT,
  BRAND_INTENTION_PARAGRAPHS,
  BRAND_INTENTION_TITLE,
  BRAND_LOGO_ALT,
  BRAND_NAME,
  BRAND_STORY_QUOTE,
  BRAND_STORY_TITLE,
  BRAND_TAGLINE,
  CONTACT_EMAIL,
  CONTACT_EMAIL_LABEL,
  CONTACT_SECTION_TITLE,
  DEVELOPER_INTRO_PARAGRAPHS,
  DEVELOPER_SECTION_TITLE,
} from '@/constants/about-config'
import logo from '@/assets/images/Linxiazhifeng.png'
import styles from './index.module.scss'

const { Paragraph, Text, Title } = Typography

/** 个人中心 - 关于。 */
export default function AboutPanel() {
  return (
    <div className={styles.aboutGrid}>
      {/* 品牌介绍 */}
      <Card className={styles.panelCard}>
        <div className={styles.brandHeader}>
          <img src={logo} alt={BRAND_LOGO_ALT} className={styles.brandLogo} />
          <div className={styles.brandText}>
            <Title level={2} className={styles.brandTitle}>{BRAND_NAME}</Title>
            <Text className={styles.brandTagline}>{BRAND_TAGLINE}</Text>
          </div>
        </div>

        <Divider className={styles.sectionDivider} />

        <div className={styles.storyBlock}>
          <div className={styles.sectionHead}>
            <ReadOutlined />
            <span>{BRAND_STORY_TITLE}</span>
          </div>
          <Paragraph className={styles.bodyText}>
            {BRAND_STORY_QUOTE}
          </Paragraph>
          <Paragraph className={styles.bodyText}>
            后世便以 <Text className={styles.highlight}>“{BRAND_HIGHLIGHT}”</Text> 赞女子气度超脱，不囿闺阁。
          </Paragraph>
        </div>

        <Divider className={styles.sectionDivider} />

        <div className={styles.storyBlock}>
          <div className={styles.sectionHead}>
            <ProjectOutlined />
            <span>{BRAND_INTENTION_TITLE}</span>
          </div>
          {BRAND_INTENTION_PARAGRAPHS.map((p) => (
            <Paragraph key={p.slice(0, 24)} className={styles.bodyText}>{p}</Paragraph>
          ))}
        </div>
      </Card>

      {/* 关于我 */}
      <Card className={styles.panelCard}>
        <Title level={3} className={styles.cardTitle}>{DEVELOPER_SECTION_TITLE}</Title>
        {DEVELOPER_INTRO_PARAGRAPHS.map((p) => (
          <Paragraph key={p.slice(0, 24)} className={styles.bodyText}>{p}</Paragraph>
        ))}

        <Divider className={styles.sectionDivider} />

        <div className={styles.contactBlock}>
          <div className={styles.sectionHead}>
            <MailOutlined />
            <span>{CONTACT_SECTION_TITLE}</span>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label={CONTACT_EMAIL_LABEL}
            className={styles.contactEmail}
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </Card>
    </div>
  )
}
