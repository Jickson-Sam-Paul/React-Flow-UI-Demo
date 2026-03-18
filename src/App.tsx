import { ReactFlowProvider } from '@xyflow/react'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import ConfigPanel from './components/ConfigPanel'
import { useWorkflowStore } from './store/workflowStore'

function App() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId)

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col bg-canvas overflow-hidden font-sans">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          {selectedNodeId && <ConfigPanel />}
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default App
