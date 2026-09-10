import { useCallback, useEffect, useState } from 'react'
import {
  getUserProfile,
  updateProfilePreferences,
  updateUserProfile,
  type EditableProfileFields,
  type ProfilePreferences,
  type UserProfile,
} from '@/api'

/** 将未知请求异常转换为可展示文本。 */
function getProfileErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '个人资料加载失败'
}

/** 管理个人中心数据请求与偏好更新。 */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await getUserProfile(signal)
      if (!signal?.aborted) {
        setProfile(response.data)
      }
    } catch (requestError) {
      if (!signal?.aborted) {
        setError(getProfileErrorMessage(requestError))
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    getUserProfile(controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) {
          setProfile(response.data)
        }
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getProfileErrorMessage(requestError))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  const savePreferences = useCallback(async (preferences: Partial<ProfilePreferences>) => {
    setIsSaving(true)

    try {
      const response = await updateProfilePreferences(preferences)
      setProfile((currentProfile) => currentProfile
        ? { ...currentProfile, preferences: response.data }
        : currentProfile)
      return response.data
    } finally {
      setIsSaving(false)
    }
  }, [])

  const saveProfile = useCallback(async (editableProfile: EditableProfileFields) => {
    setIsSavingProfile(true)

    try {
      const response = await updateUserProfile(editableProfile)
      setProfile(response.data)
      return response.data
    } finally {
      setIsSavingProfile(false)
    }
  }, [])

  const reloadProfile = useCallback(() => {
    setIsLoading(true)
    setError(null)
    void loadProfile()
  }, [loadProfile])

  return {
    profile,
    isLoading,
    isSavingProfile,
    isSaving,
    error,
    reloadProfile,
    saveProfile,
    savePreferences,
  }
}
