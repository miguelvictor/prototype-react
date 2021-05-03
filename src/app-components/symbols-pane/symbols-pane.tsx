import React, { CSSProperties, useCallback } from "react"

import { FlowchartSymbol } from "app-models"
import "./symbols-pane.scss"

export const symbolStyles: { [key in FlowchartSymbol]: CSSProperties } = {
  terminator: {
    width: "100px",
  },
  decision: {
    width: "70px",
  },
  process: {
    width: "100px",
  },
  connector: {
    width: "50px",
  },
  io: {
    width: "100px",
  },
}
export interface SymbolsPaneProps {}

export function SymbolsPane(props: SymbolsPaneProps) {
  // event listeners
  const dragStartHandler = useCallback((event) => {
    const { left, top } = event.target.getBoundingClientRect()
    const { clientX, clientY } = event

    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        intent: "add",
        symbolType: event.target.dataset.symbolType,
        offsetX: clientX - left,
        offsetY: clientY - top,
        width: event.target.offsetWidth,
        height: event.target.offsetHeight,
      })
    )
  }, [])

  return (
    <div className="symbols">
      <div className="title">Flowchart Symbols</div>
      <div className="container">
        <img
          className="symbol"
          src="/assets/terminator.svg"
          alt="Terminator"
          data-symbol-type="terminator"
          style={symbolStyles["terminator"]}
          draggable={true}
          onDragStart={dragStartHandler}
        />
        <div className="label">Terminator</div>
      </div>
      <div className="container">
        <img
          className="symbol"
          src="/assets/decision.svg"
          alt="Decision"
          data-symbol-type="decision"
          style={symbolStyles["decision"]}
          draggable={true}
          onDragStart={dragStartHandler}
        />
        <div className="label">Decision</div>
      </div>
      <div className="container">
        <img
          className="symbol"
          src="/assets/process.svg"
          alt="Process"
          data-symbol-type="process"
          style={symbolStyles["process"]}
          draggable={true}
          onDragStart={dragStartHandler}
        />
        <div className="label">Process</div>
      </div>
      <div className="container">
        <img
          className="symbol"
          src="/assets/connector.svg"
          alt="Connector"
          data-symbol-type="connector"
          style={symbolStyles["connector"]}
          draggable={true}
          onDragStart={dragStartHandler}
        />
        <div className="label">Connector</div>
      </div>
      <div className="container">
        <img
          className="symbol"
          src="/assets/io.svg"
          alt="IO"
          data-symbol-type="io"
          style={symbolStyles["io"]}
          draggable={true}
          onDragStart={dragStartHandler}
        />
        <div className="label">Input/Output</div>
      </div>
    </div>
  )
}
