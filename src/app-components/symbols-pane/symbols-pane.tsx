import React, { useCallback } from "react"
import classNames from "classnames"

import { FlowchartSymbol, SymbolDef } from "app-models"
import {
  actions,
  CursorState,
  selectCursorState,
  useAppDispatch,
  useAppSelector,
} from "app-store"
import "./symbols-pane.scss"

export const symbolsDef: { [key in FlowchartSymbol]: SymbolDef } = {
  terminator: {
    label: "Terminator",
    imgPath: "/assets/terminator.svg",
    styles: { width: "100px" },
  },
  decision: {
    label: "Decision",
    imgPath: "/assets/decision.svg",
    styles: { width: "70px" },
  },
  process: {
    label: "Process",
    imgPath: "/assets/process.svg",
    styles: { width: "100px" },
  },
  connector: {
    label: "Connector",
    imgPath: "/assets/connector.svg",
    styles: { width: "50px" },
  },
  io: {
    label: "Input/Output",
    imgPath: "/assets/io.svg",
    styles: { width: "100px" },
  },
}
export interface SymbolsPaneProps {}

export function SymbolsPane(props: SymbolsPaneProps) {
  // retrieve cursor state from store
  const cursor = useAppSelector<CursorState>(selectCursorState)
  const dispatch = useAppDispatch()

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
  const handleCursorDefault = useCallback(
    () => dispatch(actions.updateCursor("default")),
    [dispatch]
  )
  const handleCursorConnect = useCallback(
    () => dispatch(actions.updateCursor("connect")),
    [dispatch]
  )

  // subcomponents definition
  const uiSymbols = Object.entries(symbolsDef).map(
    ([id, { label, imgPath, styles }]) => (
      <div key={id} className="container">
        <img
          className="symbol"
          src={imgPath}
          alt={label}
          data-symbol-type={id}
          style={styles}
          draggable={true}
          onDragStart={dragStartHandler}
        />
        <div className="label">{label}</div>
      </div>
    )
  )

  return (
    <div className="symbols">
      <div className="title">Tools</div>
      <div className="tools">
        <img
          className={classNames({ tool: true, active: cursor === "default" })}
          src="assets/cursor-default.svg"
          alt="Default"
          onClick={handleCursorDefault}
        />
        <img
          className={classNames({ tool: true, active: cursor === "connect" })}
          src="assets/cursor-connect.svg"
          alt="Connect"
          onClick={handleCursorConnect}
        />
      </div>
      <div className="title">Flowchart Symbols</div>
      {uiSymbols}
    </div>
  )
}
