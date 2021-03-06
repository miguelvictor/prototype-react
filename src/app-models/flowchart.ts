import { CSSProperties } from "react"

export enum FlowchartSymbol {
  Terminator = "terminator",
  Decision = "decision",
  Process = "process",
  Connector = "connector",
  IO = "io",
}

export interface FlowchartSymbolPiece {
  id?: string
  type?: FlowchartSymbol
  x: number
  y: number
}

export interface SymbolDef {
  label: string
  imgPath: string
  styles: CSSProperties
}
