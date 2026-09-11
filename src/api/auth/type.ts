/** 注册请求参数 */
export interface RegisterParams {
  email: string       // 邮箱，全局唯一
  password: string    // 密码，最少 8 位
}

/** 登录请求参数 */
export interface LoginParams {
  email: string
  password: string
}

/** 登录 / 注册成功返回 */
export interface AuthResult {
  token: string
  userId: number
  email: string
  displayName: string
}
