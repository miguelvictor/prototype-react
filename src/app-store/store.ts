import { configureStore } from "@reduxjs/toolkit"

import symbolsReducer from "./slices"

export const store = configureStore({
  reducer: {
    symbols: symbolsReducer,
  },
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
