export type * from './type'

import { post } from '../http-client'
import type { ApiResponse } from '../global-type'
import type { AuthResult, LoginParams, RegisterParams } from './type'

/** 邮箱注册。 */
export function register(params: RegisterParams): Promise<ApiResponse<AuthResult>> {
  return post<AuthResult>('/auth/register', { ...params })
}

/** 邮箱密码登录。 */
export function login(params: LoginParams): Promise<ApiResponse<AuthResult>> {
  return post<AuthResult>('/auth/login', { ...params })
}

/** 退出登录（通知后端使 Token 失效）。 */
export function logout(): Promise<ApiResponse<null>> {
  return post<null>('/auth/logout')
}
