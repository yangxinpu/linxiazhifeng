export type * from './type'

import { get, patch } from '../http-client'
import type { ApiResponse } from '../global-type'
import type { EditableProfileFields, ProfilePreferences, UserProfile } from './type'

/** 获取当前用户的个人中心数据。 */
export function getUserProfile(signal?: AbortSignal): Promise<ApiResponse<UserProfile>> {
  return get<UserProfile>('/profile', undefined, { signal })
}

/** 更新当前用户的基础资料。 */
export function updateUserProfile(
  profile: EditableProfileFields,
): Promise<ApiResponse<UserProfile>> {
  return patch<UserProfile>('/profile', { ...profile })
}

/** 更新当前用户的阅读与通知偏好。 */
export function updateProfilePreferences(
  preferences: Partial<ProfilePreferences>,
): Promise<ApiResponse<ProfilePreferences>> {
  return patch<ProfilePreferences>('/profile/preferences', { ...preferences })
}
