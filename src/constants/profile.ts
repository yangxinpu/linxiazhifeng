const AVATAR_ENDPOINT = 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image'

/** 个人头像更新时用于同步导航栏的事件名。 */
export const PROFILE_AVATAR_UPDATED_EVENT = 'profile-avatar-updated'

/** 通知全局布局同步最新头像。 */
export function notifyProfileAvatarUpdated(avatarUrl: string) {
  window.dispatchEvent(new CustomEvent(PROFILE_AVATAR_UPDATED_EVENT, {
    detail: avatarUrl,
  }))
}

/** 根据描述生成站点允许使用的网络头像地址。 */
function createAvatarUrl(prompt: string): string {
  return `${AVATAR_ENDPOINT}?prompt=${encodeURIComponent(prompt)}&image_size=square`
}

/** 默认用户头像。 */
export const DEFAULT_PROFILE_AVATAR_URL = createAvatarUrl(
  'realistic editorial portrait of a young Chinese woman reader, calm thoughtful expression, natural daylight, dark shoulder-length hair, subtle green library background, centered headshot, clean composition, high detail, no text',
)
