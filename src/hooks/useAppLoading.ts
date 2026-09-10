import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading as hideLoadingAction, showLoading as showLoadingAction } from '@/stores/slices/app-status-slice'
import type { AppDispatch, RootState } from '@/stores/store'

/** 提供应用级加载状态与稳定的操作函数。 */
export function useAppLoading() {
  const isLoading = useSelector((state: RootState) => state.appStatus.isLoading)
  const dispatch = useDispatch<AppDispatch>()

  const showLoading = useCallback(() => {
    dispatch(showLoadingAction())
  }, [dispatch])

  const hideLoading = useCallback(() => {
    dispatch(hideLoadingAction())
  }, [dispatch])

  return {
    isLoading,
    showLoading,
    hideLoading,
  }
}
