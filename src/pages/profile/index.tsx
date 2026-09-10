import { useCallback } from 'react'
import {
  AppstoreOutlined,
  HeartOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import { Button, Card, Result, Skeleton, Tabs, message, type TabsProps } from 'antd'
import type { EditableProfileFields, ProfilePreferences } from '@/api'
import { notifyProfileAvatarUpdated } from '@/constants/profile'
import CollectionsPanel from './components/collections-panel'
import OverviewPanel from './components/overview-panel'
import PreferencesPanel from './components/preferences-panel'
import ProfileHeader from './components/profile-header'
import { useProfile } from './hooks/useProfile'
import styles from './index.module.scss'

/** 用户个人中心页面。 */
export default function Profile() {
  const [messageApi, messageContext] = message.useMessage()
  const {
    profile,
    isLoading,
    isSavingProfile,
    isSaving,
    error,
    reloadProfile,
    saveProfile,
    savePreferences,
  } = useProfile()

  const handleProfileChange = useCallback(async (
    editableProfile: EditableProfileFields,
  ) => {
    const messageKey = 'profile-details'
    messageApi.open({
      key: messageKey,
      type: 'loading',
      content: '正在保存资料...',
      duration: 0,
    })

    try {
      const updatedProfile = await saveProfile(editableProfile)
      notifyProfileAvatarUpdated(updatedProfile.avatarUrl)
      messageApi.open({
        key: messageKey,
        type: 'success',
        content: '个人资料已更新',
      })
    } catch (saveError) {
      messageApi.open({
        key: messageKey,
        type: 'error',
        content: saveError instanceof Error ? saveError.message : '个人资料保存失败',
      })
      throw saveError
    }
  }, [messageApi, saveProfile])

  const handlePreferenceChange = useCallback(async (
    preferences: ProfilePreferences,
  ) => {
    const messageKey = 'profile-preferences'
    messageApi.open({
      key: messageKey,
      type: 'loading',
      content: '正在保存偏好...',
      duration: 0,
    })

    try {
      await savePreferences(preferences)
      messageApi.open({
        key: messageKey,
        type: 'success',
        content: '偏好设置已更新',
      })
    } catch (saveError) {
      messageApi.open({
        key: messageKey,
        type: 'error',
        content: saveError instanceof Error ? saveError.message : '偏好设置保存失败',
      })
    }
  }, [messageApi, savePreferences])

  if (isLoading) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <Card className={styles.panelCard}>
            <Skeleton active avatar={{ size: 88 }} paragraph={{ rows: 3 }} />
          </Card>
          <Card className={styles.panelCard}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </div>
      </section>
    )
  }

  if (error || !profile) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <Result
            status="error"
            title="个人中心加载失败"
            subTitle={error ?? '暂时无法获取用户资料，请稍后重试'}
            extra={(
              <Button type="primary" onClick={reloadProfile}>
                重新加载
              </Button>
            )}
          />
        </div>
      </section>
    )
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: '阅读概览',
      icon: <AppstoreOutlined />,
      children: <OverviewPanel profile={profile} />,
    },
    {
      key: 'collections',
      label: '收藏与足迹',
      icon: <HeartOutlined />,
      children: <CollectionsPanel profile={profile} />,
    },
    {
      key: 'preferences',
      label: '阅读偏好',
      icon: <ReadOutlined />,
      children: (
        <PreferencesPanel
          profile={profile}
          isSaving={isSaving}
          onSavePreferences={handlePreferenceChange}
        />
      ),
    },
  ]

  return (
    <section className={styles.page}>
      {messageContext}
      <div className={styles.container}>
        <ProfileHeader
          profile={profile}
          isSaving={isSavingProfile}
          onProfileChange={handleProfileChange}
        />
        <Tabs
          defaultActiveKey="overview"
          items={tabItems}
          className={styles.profileTabs}
        />
      </div>
    </section>
  )
}
