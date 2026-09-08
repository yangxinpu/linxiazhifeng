export const STATUS_MESSAGE_MAP: Record<number, string> = {
  [20000]: '请求成功',
  [20100]: '创建成功',
  [40000]: '请求参数错误',
  [40100]: '未授权，请重新登录',
  [40300]: '拒绝访问',
  [40400]: '请求资源不存在',
  [50000]: '服务器内部错误',
}

export function getStatusMessage(code: number, fallback?: string): string {
  return STATUS_MESSAGE_MAP[code] || fallback || '请求失败'
}

export function isBusinessSuccess(code: number): boolean {
  return code === 20000 || code === 20100
}

export function getHttpStatusCode(code: number): number {
  return Math.floor(code / 100)
}

export function toBusinessCode(httpStatus: number): number {
  return httpStatus * 100
}
