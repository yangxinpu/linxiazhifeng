import { useCallback, useEffect, useState } from 'react'
import {
  getUserProfile,
  updateProfileCollections,
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

  const fetchProfile = useCallback(async (signal?: AbortSignal): Promise<UserProfile> => {
    const response = await getUserProfile(signal)
    return response.data
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    fetchProfile(controller.signal)
      .then((data) => {
        if (isMounted && !controller.signal.aborted) {
          setProfile(data)
          setError(null)
        }
      })
      .catch((requestError) => {
        if (isMounted && !controller.signal.aborted) {
          setError(getProfileErrorMessage(requestError))
        }
      })
      .finally(() => {
        if (isMounted && !controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [fetchProfile])

  const reloadProfile = useCallback(() => {
    setIsLoading(true)
    setError(null)
    const controller = new AbortController()
    void fetchProfile(controller.signal)
      .then((data) => setProfile(data))
      .catch((requestError) => setError(getProfileErrorMessage(requestError)))
      .finally(() => setIsLoading(false))
  }, [fetchProfile])

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

  const saveCollections = useCallback(async (
    payload: Parameters<typeof updateProfileCollections>[0],
  ) => {
    const response = await updateProfileCollections(payload)
    setProfile(response.data)
    return response.data
  }, [])

  return {
    profile,
    isLoading,
    isSavingProfile,
    isSaving,
    error,
    reloadProfile,
    saveProfile,
    saveCollections,
    savePreferences,
  }
}
