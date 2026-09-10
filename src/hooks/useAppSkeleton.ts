import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  hideGlobalSkeleton as hideGlobalSkeletonAction,
  showGlobalSkeleton as showGlobalSkeletonAction,
} from '@/stores/slices/app-ui-slice'
import type { AppDispatch, RootState } from '@/stores/store'

/** 提供应用级骨架屏状态与稳定的操作函数。 */
export function useAppSkeleton() {
  const isGlobalSkeletonVisible = useSelector(
    (state: RootState) => state.appUi.globalSkeletonRequestCount > 0,
  )
  const dispatch = useDispatch<AppDispatch>()

  const showGlobalSkeleton = useCallback(() => {
    dispatch(showGlobalSkeletonAction())
  }, [dispatch])

  const hideGlobalSkeleton = useCallback(() => {
    dispatch(hideGlobalSkeletonAction())
  }, [dispatch])

  return {
    isGlobalSkeletonVisible,
    showGlobalSkeleton,
    hideGlobalSkeleton,
  }
}
