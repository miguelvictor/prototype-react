import React, { useCallback, useMemo, useState } from "react"

import { symbolsDef } from "app-components/symbols-pane"
import { FlowchartSymbolPiece } from "app-models"
import {
  useAppSelector,
  useAppDispatch,
  selectSymbols,
  actions,
} from "app-store"
import "./workspace-pane.scss"

interface SymbolHandlesDefinition {
  top: [number, number]
  right: [number, number]
  bottom: [number, number]
  left: [number, number]
}

const workspacePadding = 10

export function WorkspacePane() {
  // retrieve symbols from store
  const symbols = useAppSelector<FlowchartSymbolPiece[]>(selectSymbols)
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
  const mouseOverHandler = useCallback(
    (event) => {
      const { left, top } = event.target.getBoundingClientRect()
      const { offsetWidth: w, offsetHeight: h } = event.target

      setHandles({
        top: [left + w / 2 - 4, top - 4],
        right: [left + w - 4, top + h / 2 - 4],
        bottom: [left + w / 2 - 4, top + h - 4],
        left: [left - 4, top + h / 2 - 4],
      })
    },
    [setHandles]
  )
  const mouseLeaveHandler = useCallback(() => setHandles(undefined), [
    setHandles,
  ])

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
            ></span>
          ))
        : [],
    [handles]
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
          data-piece-id={id}
          onMouseOver={mouseOverHandler}
          onMouseLeave={mouseLeaveHandler}
          onDragStart={dragStartHandler}
        />
      )),
    [symbols]
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
