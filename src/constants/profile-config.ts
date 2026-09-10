/** 个人头像更新时用于同步导航栏的事件名。 */
export const PROFILE_AVATAR_UPDATED_EVENT = 'profile-avatar-updated'

/** 通知全局布局同步最新头像。 */
export function notifyProfileAvatarUpdated(avatarUrl: string) {
  window.dispatchEvent(new CustomEvent(PROFILE_AVATAR_UPDATED_EVENT, {
    detail: avatarUrl,
  }))
}

/** 默认用户头像。 */
export const DEFAULT_PROFILE_AVATAR_URL = 'https://avatars.githubusercontent.com/u/187100212?v=4'
