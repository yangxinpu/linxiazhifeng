// src/hooks/useRequest.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import { RequestError } from '../api/http-error'

// 请求函数类型
type RequestFn<P extends unknown[], D> = (...params: P) => Promise<D>

// Hook 配置项
interface UseRequestOptions<P extends unknown[], D> {
  /** 组件挂载时是否自动执行一次请求，默认 false */
  auto?: boolean
  /** 自动执行时的默认参数 */
  defaultParams?: P
  /** 是否自动弹出错误提示，默认 true */
  showError?: boolean
  /** 请求成功回调 */
  onSuccess?: (data: D, params: P) => void
  /** 请求失败回调 */
  onError?: (error: RequestError, params: P) => void
  /** 请求结束回调（无论成功失败） */
  onFinally?: (params: P) => void
}

// Hook 返回值
interface UseRequestResult<P extends unknown[], D> {
  /** 响应数据，请求失败时为 undefined */
  data?: D
  /** 错误对象，请求成功时为 undefined */
  error?: RequestError
  /** 加载状态 */
  loading: boolean
  /** 手动触发请求，传入请求参数 */
  run: (...params: P) => Promise<D | undefined>
  /** 使用上一次参数重新请求 */
  refresh: () => Promise<D | undefined>
}

export function useRequest<P extends unknown[], D>(
  requestFn: RequestFn<P, D>,
  options: UseRequestOptions<P, D> = {}
): UseRequestResult<P, D> {
  const {
    auto = false,
    defaultParams = [] as unknown as P,
    showError = true,
    onSuccess,
    onError,
    onFinally,
  } = options

  // 响应状态
  const [data, setData] = useState<D>()
  const [error, setError] = useState<RequestError>()
  const [loading, setLoading] = useState(false)

  // 缓存上一次请求参数，供 refresh 使用
  const lastParamsRef = useRef<P>(defaultParams)
  // 请求序号：解决竞态问题，确保旧请求不会覆盖新请求
  const requestCountRef = useRef(0)
  // 组件卸载标记：防止卸载后 setState 导致内存泄漏
  const unmountedRef = useRef(false)

  const run = useCallback(
    async (...params: P): Promise<D | undefined> => {
      // 更新缓存参数
      lastParamsRef.current = params
      // 请求序号自增，标记当前请求
      requestCountRef.current += 1
      const currentRequestCount = requestCountRef.current

      setLoading(true)
      setError(undefined)

      try {
        const result = await requestFn(...params)

        // 竞态校验 + 卸载校验：组件已卸载 或 有更新的请求，丢弃本次结果
        if (unmountedRef.current || currentRequestCount !== requestCountRef.current) {
          return
        }

        setData(result)
        onSuccess?.(result, params)
        return result
      } catch (e) {
        if (unmountedRef.current || currentRequestCount !== requestCountRef.current) {
          return
        }

        const err = e as RequestError
        setError(err)

        // 自动错误提示
        if (showError) {
          message.error(err.message || '请求失败')
        }

        onError?.(err, params)
        return undefined
      } finally {
        if (!unmountedRef.current && currentRequestCount === requestCountRef.current) {
          setLoading(false)
        }
        onFinally?.(params)
      }
    },
    [requestFn, showError, onSuccess, onError, onFinally]
  )

  // 重新请求：复用上次参数
  const refresh = useCallback(() => run(...lastParamsRef.current), [run])

  // 组件生命周期：自动执行 + 卸载标记
  useEffect(() => {
    unmountedRef.current = false

    if (auto) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      run(...defaultParams)
    }

    return () => {
      unmountedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    data,
    error,
    loading,
    run,
    refresh,
  }
}
