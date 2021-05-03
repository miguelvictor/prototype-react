import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { FlowchartSymbolPiece } from "app-models"
import { AppState } from "./store"
import { generateUniqueID } from "./utils"

interface SymbolsState {
  value: FlowchartSymbolPiece[]
}

const initialState: SymbolsState = {
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
  },
})

export const actions = symbolsSlice.actions
export const selectSymbols = (state: AppState) => state.symbols.value
export default symbolsSlice.reducer
