import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const TOKEN_KEY = 'token'
const USER_ID_KEY = 'userId'

interface AuthState {
  /** 当前登录状态 */
  isAuthenticated: boolean
  /** 当前用户 ID，未登录时为 null */
  userId: number | null
  /** 当前用户邮箱（用于在 Header 展示） */
  email: string | null
  /** 登录中的 loading 状态 */
  isLoading: boolean
}

const initialState: AuthState = {
  isAuthenticated: typeof localStorage !== 'undefined' && !!localStorage.getItem(TOKEN_KEY),
  userId: (() => {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null
    return raw ? Number(raw) : null
  })(),
  email: null,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** 登录 / 注册成功：写入 token 并更新状态。 */
    setAuthenticated(state, action: PayloadAction<{ token: string; userId: number; email: string }>) {
      state.isAuthenticated = true
      state.userId = action.payload.userId
      state.email = action.payload.email
      localStorage.setItem(TOKEN_KEY, action.payload.token)
      localStorage.setItem(USER_ID_KEY, String(action.payload.userId))
    },

    /** 退出登录：清除 token 并重置状态。 */
    clearAuth(state) {
      state.isAuthenticated = false
      state.userId = null
      state.email = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_ID_KEY)
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
  },
})

export const { setAuthenticated, clearAuth, setLoading } = authSlice.actions
export default authSlice.reducer
