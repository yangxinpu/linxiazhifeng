import { useEffect, useRef, useState } from 'react'
import {
  ClockCircleOutlined,
  EditOutlined,
  HeartOutlined,
  LogoutOutlined,
  StarOutlined,
  ReadOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Statistic,
  Typography,
  Upload,
  type UploadProps,
} from 'antd'
import type { EditableProfileFields, UserProfile } from '@/api'
import { formatDate } from '@/utils'
import styles from './index.module.scss'

const { Link: ExternalLink, Paragraph, Text, Title } = Typography
const MAX_AVATAR_SIZE = 2 * 1024 * 1024

interface ProfileHeaderProps {
  profile: UserProfile
  isSaving: boolean
  onProfileChange: (profile: EditableProfileFields) => Promise<void>
  onLogout: () => void
}

/** 展示用户资料并提供资料编辑入口。 */
export default function ProfileHeader({
  profile,
  isSaving,
  onProfileChange,
  onLogout,
}: ProfileHeaderProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [form] = Form.useForm<EditableProfileFields>()
  const avatarReaderRef = useRef<FileReader | null>(null)
  const isEditOpenRef = useRef(false)
  const avatarUrl = Form.useWatch('avatarUrl', form) ?? profile.avatarUrl
  const readingHours = Math.round(profile.stats.totalMinutes / 60)
  const todayKey = new Date().toISOString().slice(0, 10)
  const todayMinutes = profile.readingCalendars
    .flatMap((calendar) => calendar.days)
    .find((record) => record.date === todayKey)?.minutes ?? 0

  useEffect(() => () => {
    avatarReaderRef.current?.abort()
  }, [])

  function handleOpenEdit() {
    form.setFieldsValue({
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      email: profile.email,
      website: profile.website,
    })
    isEditOpenRef.current = true
    setIsEditOpen(true)
  }

  const handleAvatarUpload: UploadProps['beforeUpload'] = (file) => {
    if (!file.type.startsWith('image/')) {
      form.setFields([{ name: 'avatarUrl', errors: ['请选择图片文件'] }])
      return Upload.LIST_IGNORE
    }

    if (file.size > MAX_AVATAR_SIZE) {
      form.setFields([{ name: 'avatarUrl', errors: ['头像图片不能超过 2 MB'] }])
      return Upload.LIST_IGNORE
    }

    avatarReaderRef.current?.abort()
    const reader = new FileReader()
    avatarReaderRef.current = reader
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string' && isEditOpenRef.current) {
        form.setFieldValue('avatarUrl', reader.result)
        form.setFields([{ name: 'avatarUrl', errors: [] }])
      }
      avatarReaderRef.current = null
    })
    reader.addEventListener('error', () => {
      if (isEditOpenRef.current) {
        form.setFields([{ name: 'avatarUrl', errors: ['头像读取失败，请重新选择'] }])
      }
      avatarReaderRef.current = null
    })
    reader.readAsDataURL(file)

    return Upload.LIST_IGNORE
  }

  async function handleSaveProfile() {
    try {
      const editableProfile = await form.validateFields()
      await onProfileChange(editableProfile)
      isEditOpenRef.current = false
      setIsEditOpen(false)
    } catch {
      // 表单校验和请求错误已由 Ant Design 与页面消息分别反馈。
    }
  }

  function handleCancelEdit() {
    avatarReaderRef.current?.abort()
    avatarReaderRef.current = null
    isEditOpenRef.current = false
    form.resetFields()
    setIsEditOpen(false)
  }

  return (
    <>
      <Card className={`${styles.panelCard} ${styles.profileHeader}`}>
        <div className={styles.profileHeaderMain}>
          <div className={styles.identity}>
            <Avatar
              size={88}
              src={profile.avatarUrl}
              alt={`${profile.displayName}的头像`}
              className={styles.avatar}
            >
              {profile.displayName.slice(0, 1)}
            </Avatar>

            <div className={styles.identityContent}>
              <Title level={1} className={styles.profileName}>
                {profile.displayName}
              </Title>
              <div className={styles.mottoBlock}>
                <span className={styles.mottoLabel}>座右铭</span>
                <Paragraph className={styles.bio}>{profile.bio}</Paragraph>
              </div>

              <Space size={[16, 6]} wrap className={styles.identityMeta}>
                <Text>
                  <span className={styles.metaLabel}>邮箱</span>                  
                  {profile.email}
                </Text>
                <ExternalLink href={profile.website} target="_blank" rel="noreferrer">
                  <span className={styles.metaLabel}>个人网站</span>
                  {profile.website}
                </ExternalLink>
                <Text>
                  <span className={styles.metaLabel}>注册时间</span>
                  {formatDate(profile.joinedAt)} 
                </Text>
              </Space>
            </div>
          </div>

          <Space size={8} className={styles.headerActions}>
            <Popconfirm
              title="确定要退出登录吗？"
              okText="退出登录"
              cancelText="再想想"
              okButtonProps={{ danger: true }}
              onConfirm={onLogout}
            >
              <Button danger icon={<LogoutOutlined />}>
                退出登录
              </Button>
            </Popconfirm>
            <Button icon={<EditOutlined />} onClick={handleOpenEdit} className={styles.editProfileButton}>
              编辑资料
            </Button>
          </Space>
        </div>

        <Divider className={styles.profileDivider} />

        <div className={styles.statistics}>
          <div>
            <Statistic prefix={<ReadOutlined />} title="阅读天数" value={profile.stats.readingDays} suffix="天" />
          </div>
          <div>
            <Statistic prefix={<ClockCircleOutlined />} title="累计时间" value={readingHours} suffix="小时" />
          </div>
          <div>
            <Statistic prefix={<StarOutlined />} title="内容收藏" value={profile.stats.favoriteCount} />
          </div>
          <div>
            <Statistic prefix={<HeartOutlined />} title="内容点赞" value={profile.stats.likeCount} />
          </div>
          <div>
            <Statistic prefix={<ClockCircleOutlined />} title="今日阅读" value={todayMinutes} suffix="分钟" />
          </div>
        </div>
      </Card>

      <Modal
        title="编辑个人资料"
        open={isEditOpen}
        okText="保存"
        cancelText="取消"
        confirmLoading={isSaving}
        onOk={() => void handleSaveProfile()}
        onCancel={handleCancelEdit}
        destroyOnHidden
        className={styles.profileModal}
      >
        <Form form={form} layout="vertical" requiredMark={false} className={styles.profileForm}>
          <Form.Item label="头像">
            <div className={styles.avatarUpload}>
              <Avatar src={avatarUrl} alt="头像预览" size={72}>
                {profile.displayName.slice(0, 1)}
              </Avatar>
              <div>
                <Upload
                  accept="image/png,image/jpeg,image/webp"
                  showUploadList={false}
                  beforeUpload={handleAvatarUpload}
                >
                  <Button icon={<UploadOutlined />}>上传头像</Button>
                </Upload>
                <Text className={styles.avatarUploadHint}>支持 JPG、PNG、WebP，最大 2 MB</Text>
              </div>
            </div>
          </Form.Item>
          <Form.Item name="avatarUrl" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="displayName"
            label="昵称"
            rules={[
              { required: true, message: '请输入昵称' },
              { max: 20, message: '昵称不能超过 20 个字符' },
            ]}
          >
            <Input placeholder="请输入昵称" maxLength={20} showCount />
          </Form.Item>

          <Form.Item
            name="bio"
            label="座右铭"
            rules={[
              { max: 80, message: '座右铭不能超过 80 个字符' },
            ]}
          >
            <Input.TextArea
              placeholder="留下一句话，让它成为你阅读路上的注脚"
              maxLength={80}
              showCount
              autoSize={{ minRows: 2, maxRows: 3 }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="name@example.com" />
          </Form.Item>

          <Form.Item
            name="website"
            label="个人主页"
            rules={[
              { required: true, message: '请输入个人主页地址' },
              { type: 'url', message: '请输入以 http:// 或 https:// 开头的地址' },
            ]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
