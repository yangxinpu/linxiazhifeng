import { configureStore } from '@reduxjs/toolkit'
import { appStatusSlice } from './slices/app-status-slice'

/** 应用级 Redux store。 */
export const store = configureStore({
  reducer: {
    appStatus: appStatusSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
