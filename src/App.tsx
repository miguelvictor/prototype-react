import React from "react"
import { Provider } from "react-redux"

import { SymbolsPane, WorkspacePane } from "app-components"
import { store } from "app-store"
import "./App.scss"

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="header">
          <div className="title">Flowchart Prototype</div>
        </div>
        <div className="symbols-pane">
          <SymbolsPane />
        </div>
        <div className="workspace-pane">
          <WorkspacePane />
        </div>
        <div className="preview-pane"></div>
      </div>
    </Provider>
  )
}

export default App
