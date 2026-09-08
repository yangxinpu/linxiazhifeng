/**
 * HTTP 状态码映射用户友好提示文案
 * @param status http响应状态码
 * @returns 展示给用户的提示文本
 */

export const HTTP_STATUS_MAP: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '无权限访问该资源',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂时不可用',
  504: '网关超时',
};
export function mapHttpStatusToMessage(status: number): string {
  return HTTP_STATUS_MAP[status] || `请求失败（${status}）`;
}

/**
 * 业务状态码映射
 * 业务状态码由前后端共同约定，code != 000000 代表业务异常
 * key: 后端返回业务code(number)
 * value: 用户友好提示文案
 */
export const BUSINESS_CODE_MAP: Record<number, string> = {
  10001: '账号不存在',
  10002: '密码错误',
  10003: '账号已被禁用',
  10004: 'Token已失效，请重新登录',
  20001: '操作权限不足',
  20002: '资源不存在',
  30001: '参数校验失败',
  30002: '数据重复，请勿重复提交',
  40001: '文件上传大小超出限制',
  40002: '文件格式不支持',
};

/**
 * 根据后端业务code获取用户提示文案
 * @param businessCode 后端返回业务状态码
 * @param defaultMsg 兜底文案（后端返回message优先使用）
 * @returns 用户展示文案
 */
export function mapBusinessCodeToMessage(businessCode: number, defaultMsg: string): string {
  return BUSINESS_CODE_MAP[businessCode] || defaultMsg;
}