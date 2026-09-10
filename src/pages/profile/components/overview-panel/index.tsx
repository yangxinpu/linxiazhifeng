import { useMemo, useState } from 'react'
import { Card, Select, Tooltip, Typography } from 'antd'
import type { DailyReadingRecord, UserProfile } from '@/api'
import { formatDate } from '@/utils'
import styles from './index.module.scss'

const { Text } = Typography
const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

interface OverviewPanelProps {
  profile: UserProfile
}

interface CalendarCell {
  key: string
  record: DailyReadingRecord | null
}

/** 根据阅读分钟数返回绿墙深度。 */
function getContributionClass(minutes: number): string {
  if (minutes === 0) return styles.contributionLevel0
  if (minutes <= 20) return styles.contributionLevel1
  if (minutes <= 40) return styles.contributionLevel2
  if (minutes <= 60) return styles.contributionLevel3
  return styles.contributionLevel4
}

/** 展示按自然年组织的每日阅读绿墙。 */
export default function OverviewPanel({ profile }: OverviewPanelProps) {
  const availableYears = profile.readingCalendars.map((calendar) => calendar.year)
  const [selectedYear, setSelectedYear] = useState(Math.max(...availableYears))
  const selectedCalendar = profile.readingCalendars.find(
    (calendar) => calendar.year === selectedYear,
  ) ?? profile.readingCalendars[0]

  const calendarCells = useMemo<CalendarCell[]>(() => {
    const firstWeekday = new Date(Date.UTC(selectedCalendar.year, 0, 1)).getUTCDay()
    const firstDayOffset = (firstWeekday + 6) % 7
    const emptyCells = Array.from({ length: firstDayOffset }, (_, index) => ({
      key: `empty-${index}`,
      record: null,
    }))
    const readingCells = selectedCalendar.days.map((record) => ({
      key: record.date,
      record,
    }))

    return [...emptyCells, ...readingCells]
  }, [selectedCalendar])

  return (
    <Card
      title="阅读概要"
      extra={(
        <Select
          value={selectedYear}
          aria-label="选择阅读年份"
          options={availableYears.map((year) => ({ label: `${year} 年`, value: year }))}
          onChange={setSelectedYear}
          className={styles.yearSelect}
        />
      )}
      className={`${styles.panelCard} ${styles.contributionCard}`}
    >
      <div className={styles.contributionScroller}>
        <div className={styles.contributionContent}>
          <div className={styles.monthLabels}>
            {MONTH_LABELS.map((month) => <span key={month}>{month}</span>)}
          </div>

          <div className={styles.contributionBody}>
            <div className={styles.weekLabels} aria-hidden="true">
              {WEEKDAY_LABELS.map((weekday) => <span key={weekday}>{weekday}</span>)}
            </div>

            <div
              className={styles.contributionGrid}
              role="img"
              aria-label={`${selectedCalendar.year} 年每日阅读记录`}
            >
              {calendarCells.map((cell) => (
                cell.record ? (
                  <Tooltip
                    key={cell.key}
                    title={`${formatDate(cell.record.date)} · ${cell.record.minutes} 分钟`}
                  >
                    <span
                      className={`${styles.contributionCell} ${getContributionClass(cell.record.minutes)}`}
                      aria-label={`${formatDate(cell.record.date)}，阅读 ${cell.record.minutes} 分钟`}
                    />
                  </Tooltip>
                ) : (
                  <span key={cell.key} className={styles.contributionPlaceholder} />
                )
              ))}
            </div>
          </div>

          <div className={styles.contributionLegend}>
            <Text>少</Text>
            <span className={`${styles.contributionCell} ${styles.contributionLevel0}`} />
            <span className={`${styles.contributionCell} ${styles.contributionLevel1}`} />
            <span className={`${styles.contributionCell} ${styles.contributionLevel2}`} />
            <span className={`${styles.contributionCell} ${styles.contributionLevel3}`} />
            <span className={`${styles.contributionCell} ${styles.contributionLevel4}`} />
            <Text>多</Text>
          </div>
        </div>
      </div>
    </Card>
  )
}
