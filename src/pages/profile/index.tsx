import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  AppstoreOutlined,
  InfoCircleOutlined,
  StarOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import { Button, Card, Result, Skeleton, Tabs, message, type TabsProps } from 'antd'
import type { Dispatch } from '@reduxjs/toolkit'
import type { EditableProfileFields, ProfilePreferences } from '@/api'
import { logout } from '@/api'
import { clearAuth } from '@/stores/slices/auth-slice'
import AboutPanel from './components/about-panel'
import CollectionsPanel from './components/collections-panel'
import OverviewPanel from './components/overview-panel'
import PreferencesPanel from './components/preferences-panel'
import ProfileHeader from './components/profile-header'
import { useProfile } from './hooks/useProfile'
import styles from './index.module.scss'

/** 用户个人中心页面。 */
export default function Profile() {
  const [messageApi, messageContext] = message.useMessage()
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()
  const {
    profile,
    isLoading,
    isSavingProfile,
    isSaving,
    error,
    reloadProfile,
    saveProfile,
    saveCollections,
    savePreferences,
  } = useProfile()

  const handleCollectionsChange = useCallback(async (
    payload: Parameters<typeof saveCollections>[0],
  ) => {
    const messageKey = 'profile-collections'
    messageApi.open({
      key: messageKey,
      type: 'loading',
      content: '正在更新...',
      duration: 0,
    })

    try {
      await saveCollections(payload)
      messageApi.open({
        key: messageKey,
        type: 'success',
        content: '收藏已更新',
      })
    } catch (saveError) {
      messageApi.open({
        key: messageKey,
        type: 'error',
        content: saveError instanceof Error ? saveError.message : '更新失败，请稍后重试',
      })
    }
  }, [messageApi, saveCollections])

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
      await saveProfile(editableProfile)
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

  const handleLogout = useCallback(async () => {
    try {
      await logout()
    } catch {
      // 后端 logout 失败不影响本地清理
    }
    dispatch(clearAuth())
    message.success('已退出登录')
    navigate('/', { replace: true })
  }, [dispatch, navigate])

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
      icon: <StarOutlined />,
      children: <CollectionsPanel profile={profile} onCollectionsChange={handleCollectionsChange} />,
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
    {
      key: 'about',
      label: '关于我们',
      icon: <InfoCircleOutlined />,
      children: <AboutPanel />,
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
          onLogout={handleLogout}
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
