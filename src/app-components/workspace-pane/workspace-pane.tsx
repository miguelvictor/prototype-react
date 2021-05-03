import React, { useCallback } from "react"

import { symbolStyles } from "app-components/symbols-pane"
import { FlowchartSymbolPiece } from "app-models"
import {
  useAppSelector,
  useAppDispatch,
  selectSymbols,
  actions,
} from "app-store"
import "./workspace-pane.scss"

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

  // sub components
  const uiSymbols = symbols.map(({ id, x, y, type }) => (
    <img
      key={id}
      className="symbol on-workspace"
      src={`/assets/${type}.svg`}
      alt={type}
      style={{
        ...symbolStyles[type!],
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
      }}
      data-piece-id={id}
      onDragStart={dragStartHandler}
    />
  ))

  return (
    <div
      className="workspace"
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
    >
      {uiSymbols}
    </div>
  )
}
