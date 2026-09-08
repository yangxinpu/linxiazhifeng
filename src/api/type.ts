// src/api/types.ts

/**
 * 后端统一响应结构约定
 * 后端所有接口返回外层结构必须遵守该格式
 */
export interface ApiResponse<T> {
  code: number | string;
  message: string;
  data: T;
}

/**
 * 通用分页查询入参
 */
export interface PageQuery {
  pageNum: number;
  pageSize: number;
}

/**
 * 通用分页返回data结构
 * 配合 ApiResponse 使用：ApiResponse<PageResult<T>>
 */
export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/**
 * 文件上传通用返回类型
 */
export interface FileUploadResp {
  url: string;
  fileName: string;
  fileSize: number;
}