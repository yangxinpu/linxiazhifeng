/**
 * 错误类型枚举
 * NETWORK_ERROR：网络层异常（无网、超时、DNS失败）
 * SERVER_ERROR：HTTP层异常（4xx/5xx http状态码）
 * BUSINESS_ERROR：业务层异常（后端返回code非0，业务逻辑错误）
 */
 
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  BUSINESS_ERROR = 'BUSINESS_ERROR',
}

/**
 * 自定义请求错误类，所有请求异常统一抛出该实例
 */
export class RequestError extends Error {
  /** 错误分类 */
  public readonly type: ErrorType;
  /** 错误码：HTTP状态码 / 后端业务code */
  public readonly code: number | string;
  /** 用户友好提示文案 */
  public readonly message: string;
  /** 原始错误对象，用于调试排查 */
  public readonly raw?: Error;

  constructor(type: ErrorType, code: number | string, message: string, raw?: Error) {
    super(message);
    this.name = 'RequestError';
    this.type = type;
    this.code = code;
    this.message = message;
    this.raw = raw;
  }
}