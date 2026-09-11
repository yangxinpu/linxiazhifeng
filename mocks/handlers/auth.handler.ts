import { http, HttpResponse, delay } from 'msw'
import type { AuthResult, LoginParams, RegisterParams } from '@/api/auth'

const BASE_URL = '/api'

interface MockUser {
  id: number
  email: string
  password: string // 仅 mock 内部使用
  displayName: string
}

// 预设的"种子"用户：email=demo@linxiazhifeng.com / password=Demo12345
const MOCK_USERS: MockUser[] = [
  {
    id: 10001,
    email: 'demo@linxiazhifeng.com',
    password: 'Demo12345',
    displayName: '林知夏',
  },
]

/** 为每次 mock 登录生成唯一 token。 */
function generateToken(userId: number): string {
  return `mock-token-${userId}-${Date.now()}`
}

/** 校验邮箱格式（与前端 Form 校验规则保持一致）。 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const authHandlers = [
  // 注册
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    await delay(400)

    const body = (await request.json()) as RegisterParams

    if (!body.email || !isValidEmail(body.email)) {
      return HttpResponse.json(
        { code: 30001, message: '请输入有效的邮箱地址', data: null },
        { status: 400 },
      )
    }

    if (!body.password || body.password.length < 8) {
      return HttpResponse.json(
        { code: 30001, message: '密码至少需要 8 位字符', data: null },
        { status: 400 },
      )
    }

    const isDuplicate = MOCK_USERS.some((u) => u.email.toLowerCase() === body.email.toLowerCase())
    if (isDuplicate) {
      return HttpResponse.json(
        { code: 30002, message: '该邮箱已被注册，请直接登录', data: null },
        { status: 409 },
      )
    }

    const newId = Math.max(10000, ...MOCK_USERS.map((u) => u.id)) + 1
    const newUser: MockUser = {
      id: newId,
      email: body.email,
      password: body.password,
      displayName: body.email.split('@')[0],
    }
    MOCK_USERS.push(newUser)

    const authResult: AuthResult = {
      token: generateToken(newId),
      userId: newId,
      email: newUser.email,
      displayName: newUser.displayName,
    }

    return HttpResponse.json({
      code: 0,
      message: '注册成功',
      data: authResult,
    })
  }),

  // 登录
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    await delay(300)

    const body = (await request.json()) as LoginParams

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { code: 30001, message: '请输入邮箱和密码', data: null },
        { status: 400 },
      )
    }

    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === body.email.toLowerCase())
    if (!user) {
      return HttpResponse.json(
        { code: 10001, message: '账号不存在', data: null },
        { status: 404 },
      )
    }

    if (user.password !== body.password) {
      return HttpResponse.json(
        { code: 10002, message: '密码错误', data: null },
        { status: 401 },
      )
    }

    const authResult: AuthResult = {
      token: generateToken(user.id),
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
    }

    return HttpResponse.json({
      code: 0,
      message: '登录成功',
      data: authResult,
    })
  }),

  // 退出登录
  http.post(`${BASE_URL}/auth/logout`, async () => {
    await delay(120)

    return HttpResponse.json({
      code: 0,
      message: '已退出登录',
      data: null,
    })
  }),
]
