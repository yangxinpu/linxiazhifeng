import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type { ApiResponse } from './global-type'
import { mapHttpStatusToMessage, mapBusinessCodeToMessage } from './status-code-map'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>

    if (data.code !== 0) {
      const message = data.message || mapBusinessCodeToMessage(Number(data.code), '请求失败')
      return Promise.reject(new Error(message))
    }

    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const message = (data as ApiResponse<unknown>)?.message || mapHttpStatusToMessage(status)
      return Promise.reject(new Error(message))
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时'))
    }

    return Promise.reject(new Error('网络异常，请检查网络连接'))
  },
)

// GET 请求
export function get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return request.get(url, { params, ...config })
}

// POST 请求
export function post<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return request.post(url, data, config)
}

// PUT 请求
export function put<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return request.put(url, data, config)
}

// PATCH 请求
export function patch<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return request.patch(url, data, config)
}

// DELETE 请求
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return request.delete(url, config)
}

export default request
