import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Tabs, Card, Typography, message, Modal } from 'antd'
import type { Dispatch } from '@reduxjs/toolkit'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { login, register, type LoginParams, type RegisterParams } from '@/api'
import { setAuthenticated } from '@/stores/slices/auth-slice'
import styles from './index.module.scss'

const { Link } = Typography

type AuthTab = 'login' | 'register'

/** 宽松但合理的邮箱正则：允许子域名、国际域名等常见格式。 */
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

/** 邮箱字段共用的校验规则。 */
const EMAIL_RULES = [
  { required: true, message: '请输入邮箱' },
  {
    validator(_: unknown, value: string | undefined) {
      if (!value) return Promise.resolve()
      if (EMAIL_REGEX.test(value.trim())) return Promise.resolve()
      return Promise.reject(new Error('请输入有效的邮箱地址'))
    },
  },
]

/** 登录 / 注册统一页面。支持 Tab 切换，注册成功后弹引导设置资料。 */
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false)
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const [loginForm] = Form.useForm<LoginParams>()
  const [registerForm] = Form.useForm<RegisterParams>()

  // 登录前用户原本想访问的页面，登录后跳回去
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'

  async function handleLogin(values: LoginParams) {
    setIsSubmitting(true)
    try {
      const res = await login({ email: values.email.trim(), password: values.password })
      if (res.code === 0 && res.data) {
        dispatch(setAuthenticated(res.data))
        message.success('登录成功')
        navigate(redirectTo, { replace: true })
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegister(values: RegisterParams) {
    setIsSubmitting(true)
    try {
      const res = await register({ email: values.email.trim(), password: values.password })
      if (res.code === 0 && res.data) {
        dispatch(setAuthenticated(res.data))
        setIsWelcomeOpen(true)
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleGoProfile() {
    setIsWelcomeOpen(false)
    navigate('/profile', { replace: true })
  }

  function handleSkipWelcome() {
    setIsWelcomeOpen(false)
    navigate('/', { replace: true })
  }

  const tabItems = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form
          form={loginForm}
          layout="vertical"
          requiredMark={false}
          className={styles.authForm}
          onFinish={handleLogin}
        >
          <Form.Item name="email" label="邮箱" rules={EMAIL_RULES}>
            <Input
              prefix={<MailOutlined className={styles.inputIcon} />}
              placeholder="name@example.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少需要 8 位字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="至少 8 位字符"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className={styles.submitItem}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isSubmitting}
            >
              登录
            </Button>
          </Form.Item>

          <div className={styles.formFooter}>
            还没有账号？
            <Link onClick={() => setActiveTab('register')}>立即注册</Link>
          </div>

          <div className={styles.demoHint}>
            演示账号：demo@linxiazhifeng.com / Demo12345
          </div>
        </Form>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form
          form={registerForm}
          layout="vertical"
          requiredMark={false}
          className={styles.authForm}
          onFinish={handleRegister}
        >
          <Form.Item name="email" label="邮箱" rules={EMAIL_RULES}>
            <Input
              prefix={<MailOutlined className={styles.inputIcon} />}
              placeholder="name@example.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少需要 8 位字符' },
            ]}
            extra="至少 8 位字符，建议包含字母和数字"
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="至少 8 位字符"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="再次输入密码"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item className={styles.submitItem}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isSubmitting}
            >
              创建账号
            </Button>
          </Form.Item>

          <div className={styles.formFooter}>
            已有账号？
            <Link onClick={() => setActiveTab('login')}>立即登录</Link>
          </div>
        </Form>
      ),
    },
  ]

  return (
    <>
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skipAction}>
            <Link onClick={() => navigate('/')}>暂不登录，继续浏览 →</Link>
          </div>

          <Card className={styles.card} bordered={false}>
            <div className={styles.hero}>
              <Typography.Title level={2} className={styles.brandTitle}>
                Linxiazhifeng
              </Typography.Title>
              <Typography.Text className={styles.brandTagline}>
                在文字里寻找缓慢而坚定的力量
              </Typography.Text>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as AuthTab)}
              items={tabItems}
              className={styles.tabs}
            />
          </Card>
        </div>
      </section>

      <Modal
        open={isWelcomeOpen}
        title="🎉 欢迎加入"
        onOk={handleGoProfile}
        onCancel={handleSkipWelcome}
        okText="去设置资料"
        cancelText="先跳过"
        centered
        width={440}
      >
        <div className={styles.welcomeContent}>
          <UserOutlined className={styles.welcomeIcon} />
          <Typography.Paragraph>
            账号创建成功！你可以前往个人中心设置昵称、头像和座右铭，让阅读体验更完整。
          </Typography.Paragraph>
          <Typography.Paragraph type="secondary" className={styles.welcomeTip}>
            随时可以在头像处进入个人中心修改资料。
          </Typography.Paragraph>
        </div>
      </Modal>
    </>
  )
}
