/// <reference types="vite/client" />

// 覆盖 vite/client 的空 '*.scss' 声明，使其也有宽松的 CSS Modules 类型
// 这样所有 .scss 和 .module.scss 的 default import 都能接受任意 key
declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
