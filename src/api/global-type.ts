/**
 * 后端统一响应结构约定
 * 后端所有接口返回外层结构必须遵守该格式
 */
export interface ApiResponse<T> {
  code: number | string
  message: string
  data: T
}

/** 分页响应结构 */
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 分类选项（用于文章/名言等筛选） */
export interface Category {
  value: string
  label: string
}

/**
 * 文件上传通用返回类型
 */
export interface FileUploadResp {
  url: string
  fileName: string
  fileSize: number
}