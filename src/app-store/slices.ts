import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { FlowchartSymbolPiece } from "app-models"
import { AppState } from "./store"
import { generateUniqueID } from "./utils"

export type CursorState = "default" | "connect"

interface SymbolsState {
  cursor: CursorState
  value: FlowchartSymbolPiece[]
}

const initialState: SymbolsState = {
  cursor: "default",
  value: [],
}

export const symbolsSlice = createSlice({
  name: "symbols",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<FlowchartSymbolPiece>) => {
      const { payload } = action

      payload.id = generateUniqueID()
      state.value.push(payload)
    },
    move: (state, action: PayloadAction<FlowchartSymbolPiece>) => {
      const { payload } = action
      const pieceIndex = state.value.findIndex(
        (piece) => piece.id === payload.id
      )

      state.value[pieceIndex].x = payload.x
      state.value[pieceIndex].y = payload.y
    },
    updateCursor: (state, action: PayloadAction<CursorState>) => {
      const { payload } = action

      state.cursor = payload
    },
  },
})

// custom selectors
export const selectSymbols = (state: AppState) => state.symbols.value
export const selectCursorState = (state: AppState) => state.symbols.cursor

export const actions = symbolsSlice.actions
export default symbolsSlice.reducer
