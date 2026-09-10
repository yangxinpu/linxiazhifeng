import { useState } from 'react'
import { ReadOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  InputNumber,
  Segmented,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd'
import type { ProfilePreferences, UserProfile } from '@/api'
import styles from '../index.module.scss'

const { Text } = Typography

const CATEGORY_OPTIONS = [
  '文学',
  '哲学',
  '人生',
  '历史',
  '艺术',
  '科技',
  '科学',
  '智慧',
].map((category) => ({ label: category, value: category }))

interface PreferencesPanelProps {
  profile: UserProfile
  isSaving: boolean
  onSavePreferences: (preferences: ProfilePreferences) => Promise<void>
}

/** 判断阅读偏好草稿是否发生变化。 */
function isSamePreferences(
  currentPreferences: ProfilePreferences,
  draftPreferences: ProfilePreferences,
): boolean {
  return currentPreferences.dailyGoalMinutes === draftPreferences.dailyGoalMinutes
    && currentPreferences.readingDensity === draftPreferences.readingDensity
    && currentPreferences.dailyQuoteEnabled === draftPreferences.dailyQuoteEnabled
    && currentPreferences.preferredCategories.join('|') === draftPreferences.preferredCategories.join('|')
}

/** 提供批量编辑并统一保存的阅读偏好。 */
export default function PreferencesPanel({
  profile,
  isSaving,
  onSavePreferences,
}: PreferencesPanelProps) {
  const [draftPreferences, setDraftPreferences] = useState<ProfilePreferences>(() => ({
    ...profile.preferences,
    preferredCategories: [...profile.preferences.preferredCategories],
  }))
  const isDirty = !isSamePreferences(profile.preferences, draftPreferences)

  function handleCancelChanges() {
    setDraftPreferences({
      ...profile.preferences,
      preferredCategories: [...profile.preferences.preferredCategories],
    })
  }

  return (
    <Card
      title={(
        <Space>
          <ReadOutlined />
          阅读偏好
        </Space>
      )}
      extra={isDirty ? (
        <Space size={8}>
          <Button
            disabled={isSaving}
            onClick={handleCancelChanges}
          >
            取消
          </Button>
          <Button
            type="primary"
            loading={isSaving}
            onClick={() => void onSavePreferences(draftPreferences)}
          >
            提交
          </Button>
        </Space>
      ) : null}
      className={`${styles.panelCard} ${styles.preferenceCard}`}
    >
      <div className={styles.preferenceList}>
        <div className={styles.preferenceRow}>
          <div>
            <Text className={styles.preferenceTitle}>每日阅读目标</Text>
            <Text className={styles.preferenceDescription}>用于计算每日阅读计划完成度</Text>
          </div>
          <Space size={6}>
            <InputNumber
              min={10}
              max={120}
              step={5}
              value={draftPreferences.dailyGoalMinutes}
              disabled={isSaving}
              onChange={(value) => {
                if (typeof value === 'number') {
                  setDraftPreferences((currentPreferences) => ({
                    ...currentPreferences,
                    dailyGoalMinutes: value,
                  }))
                }
              }}
            />
            <Text className={styles.mutedText}>分钟</Text>
          </Space>
        </div>

        <div className={styles.preferenceRow}>
          <div>
            <Text className={styles.preferenceTitle}>阅读密度</Text>
            <Text className={styles.preferenceDescription}>控制内容列表的信息间距</Text>
          </div>
          <Segmented
            value={draftPreferences.readingDensity}
            disabled={isSaving}
            options={[
              { label: '紧凑', value: 'compact' },
              { label: '舒适', value: 'comfortable' },
              { label: '宽松', value: 'relaxed' },
            ]}
            onChange={(value) => {
              if (value === 'compact' || value === 'comfortable' || value === 'relaxed') {
                setDraftPreferences((currentPreferences) => ({
                  ...currentPreferences,
                  readingDensity: value,
                }))
              }
            }}
          />
        </div>

        <div className={styles.preferenceRow}>
          <div>
            <Text className={styles.preferenceTitle}>每日一句</Text>
            <Text className={styles.preferenceDescription}>每天推送一则精选名言</Text>
          </div>
          <Switch
            checked={draftPreferences.dailyQuoteEnabled}
            disabled={isSaving}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={(isEnabled) => {
              setDraftPreferences((currentPreferences) => ({
                ...currentPreferences,
                dailyQuoteEnabled: isEnabled,
              }))
            }}
          />
        </div>
      </div>

      <div className={styles.preferredCategories}>
        <Text className={styles.preferenceTitle}>偏好分类</Text>
        <Text className={styles.preferenceDescription}>选择现有分类或直接输入自定义分类</Text>
        <Select
          mode="tags"
          value={draftPreferences.preferredCategories}
          options={CATEGORY_OPTIONS}
          tokenSeparators={['，', ',']}
          placeholder="输入分类后按回车添加"
          disabled={isSaving}
          onChange={(preferredCategories) => {
            setDraftPreferences((currentPreferences) => ({
              ...currentPreferences,
              preferredCategories,
            }))
          }}
          className={styles.categorySelect}
        />
      </div>
    </Card>
  )
}
