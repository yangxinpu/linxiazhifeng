import { configureStore } from '@reduxjs/toolkit'
import { appUiSlice } from './slices/app-ui-slice'

/** 应用级 Redux store。 */
export const store = configureStore({
  reducer: {
    appUi: appUiSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
