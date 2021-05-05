import React, { useCallback, useEffect, useMemo, useState } from "react"

import { symbolsDef } from "app-components/symbols-pane"
import { FlowchartSymbolPiece } from "app-models"
import {
  actions,
  CursorState,
  selectSymbols,
  selectCursorState,
  useAppDispatch,
  useAppSelector,
} from "app-store"
import "./workspace-pane.scss"

interface SymbolHandlesDefinition {
  top: [number, number]
  right: [number, number]
  bottom: [number, number]
  left: [number, number]
}

const workspacePadding = 10
const handleWidth = 10

export function WorkspacePane() {
  // retrieve symbols from store
  const symbols = useAppSelector<FlowchartSymbolPiece[]>(selectSymbols)
  const cursor = useAppSelector<CursorState>(selectCursorState)
  const dispatch = useAppDispatch()

  // drag event handlers
  const dragStartHandler = useCallback((event) => {
    const { left, top } = event.target.getBoundingClientRect()
    const { clientX, clientY } = event

    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        intent: "move",
        id: event.target.dataset.pieceId,
        offsetX: clientX - left,
        offsetY: clientY - top,
        width: event.target.offsetWidth,
        height: event.target.offsetHeight,
      })
    )
  }, [])
  const dragOverHandler = useCallback((event) => event.preventDefault(), [])
  const dropHandler = useCallback(
    (event) => {
      const rawData = event.dataTransfer.getData("text/plain")
      if (!rawData) {
        return
      }

      const data = JSON.parse(rawData)
      const { id, symbolType, offsetX, offsetY, width, height } = data
      const { left, top } = event.target.getBoundingClientRect()
      const { offsetWidth, offsetHeight } = event.target
      const { clientX, clientY } = event
      let x = Math.max(clientX - offsetX, left + workspacePadding)
      let y = Math.max(clientY - offsetY, top + workspacePadding)
      x = Math.min(x, left + offsetWidth - width - workspacePadding)
      y = Math.min(y, top + offsetHeight - height - workspacePadding)

      if (data.intent === "add") {
        dispatch(actions.add({ x, y, type: symbolType }))
      } else if (data.intent === "move") {
        dispatch(actions.move({ x, y, id }))
      }
    },
    [dispatch]
  )

  // mouse hover
  const [handles, setHandles] = useState<SymbolHandlesDefinition>()
  const [isSymbolHovered, setSymbolHovered] = useState(false)
  const [isHandleHovered, setHandleHovered] = useState(false)
  const symbolMouseOverHandler = useCallback(
    (event) => {
      // this mode is only available when cursor is "connect"
      if (cursor !== "connect") return

      const { left, top } = event.target.getBoundingClientRect()
      const { offsetWidth: w, offsetHeight: h } = event.target

      setSymbolHovered(true)
      setHandles({
        top: [left + w / 2 - handleWidth / 2, top - handleWidth / 2],
        right: [left + w - handleWidth / 2, top + h / 2 - handleWidth / 2],
        bottom: [left + w / 2 - handleWidth / 2, top + h - handleWidth / 2],
        left: [left - handleWidth / 2, top + h / 2 - handleWidth / 2],
      })
    },
    [cursor, setSymbolHovered, setHandles]
  )
  const symbolMouseLeaveHandler = useCallback(() => setSymbolHovered(false), [
    setSymbolHovered,
  ])
  const handleMouseOverHandler = useCallback(() => setHandleHovered(true), [
    setHandleHovered,
  ])
  const handleMouseLeaveHandler = useCallback(() => setHandleHovered(false), [
    setHandleHovered,
  ])

  useEffect(() => {
    if (isSymbolHovered === false && isHandleHovered === false) {
      setHandles(undefined)
    }
  }, [isSymbolHovered, isHandleHovered, setHandles])

  // sub components
  const uiHandles = useMemo(
    () =>
      handles
        ? Object.values(handles).map(([x, y], i) => (
            <span
              key={i}
              className="handle"
              style={{
                position: "absolute",
                top: `${y}px`,
                left: `${x}px`,
              }}
              onMouseOver={handleMouseOverHandler}
              onMouseLeave={handleMouseLeaveHandler}
            ></span>
          ))
        : [],
    [handles, handleMouseOverHandler, handleMouseLeaveHandler]
  )
  const uiSymbols = useMemo(
    () =>
      symbols.map(({ id, x, y, type }) => (
        <img
          key={id}
          className="symbol on-workspace"
          src={symbolsDef[type!].imgPath}
          alt={symbolsDef[type!].label}
          style={{
            ...symbolsDef[type!].styles,
            position: "absolute",
            top: `${y}px`,
            left: `${x}px`,
          }}
          draggable={cursor === "default"}
          data-piece-id={id}
          onMouseOver={symbolMouseOverHandler}
          onMouseLeave={symbolMouseLeaveHandler}
          onDragStart={dragStartHandler}
        />
      )),
    [
      cursor,
      dragStartHandler,
      symbolMouseLeaveHandler,
      symbolMouseOverHandler,
      symbols,
    ]
  )

  return (
    <div
      className="workspace"
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
    >
      {uiSymbols.concat(uiHandles)}
    </div>
  )
}
