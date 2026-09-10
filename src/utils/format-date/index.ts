/**
 * 格式化日期为中文格式
 * @param dateString - 日期字符串
 * @param options - 格式化选项
 * @param options.monthFormat - 月份格式：'short' (1月) 或 'long' (一月)
 * @returns 格式化后的中文日期字符串
 */
export function formatDate(
  dateString: string,
  options?: { monthFormat?: 'short' | 'long' }
): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: options?.monthFormat || 'short',
    day: 'numeric',
  })
}
