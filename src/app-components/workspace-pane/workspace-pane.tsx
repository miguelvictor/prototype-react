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

export function WorkspacePane() {
  // retrieve symbols from store
  const symbols = useAppSelector<FlowchartSymbolPiece[]>(selectSymbols)
  const dispatch = useAppDispatch()

  // drag event handlers
  const dragStartHandler = useCallback((event) => {
    const intent = "move"
    const id = event.target.dataset.pieceId
    const { left, top } = event.target.getBoundingClientRect()
    const { clientX, clientY } = event
    const offsetX = clientX - left
    const offsetY = clientY - top
    const data = JSON.stringify({ intent, id, offsetX, offsetY })
    event.dataTransfer.setData("text/plain", data)
  }, [])
  const dragOverHandler = useCallback((event) => event.preventDefault(), [])
  const dropHandler = useCallback(
    (event) => {
      const rawData = event.dataTransfer.getData("text/plain")
      if (!rawData) {
        return
      }

      const data = JSON.parse(rawData)
      if (data.intent === "add") {
        const { symbolType: type, offsetX, offsetY } = data
        const { clientX, clientY } = event
        const x = clientX - offsetX
        const y = clientY - offsetY
        dispatch(actions.add({ x, y, type }))
      } else if (data.intent === "move") {
        const { id, offsetX, offsetY } = data
        const { clientX, clientY } = event
        const x = clientX - offsetX
        const y = clientY - offsetY
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
