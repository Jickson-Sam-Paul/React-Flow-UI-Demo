import { useState, useRef, useEffect } from 'react'
import { Play, Save, FolderOpen, Trash2, Download, Check } from 'lucide-react'
import { useWorkflowStore } from '../store/workflowStore'
import { SavedWorkflow } from '../types'

export default function Toolbar() {
  const {
    workflowName, setWorkflowName, runWorkflow, saveWorkflow,
    loadWorkflow, clearCanvas, isRunning, nodes, edges, getSavedWorkflows,
  } = useWorkflowStore()

  const [showLoad, setShowLoad] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setShowLoad(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSave = () => {
    saveWorkflow()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = () => {
    const data = JSON.stringify({ name: workflowName, nodes, edges }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const savedWorkflows = getSavedWorkflows()

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-panel border-b border-border z-10 relative">
      {/* Workflow name */}
      <div className="flex items-center gap-3">
        {isEditing ? (
          <input
            ref={inputRef}
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="bg-surface border border-accent rounded-md px-2 py-1 text-white text-sm outline-none font-medium min-w-[160px]"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-white text-sm font-medium hover:text-accent transition-colors"
          >
            {workflowName}
          </button>
        )}
        <span className="text-subtle text-[10px] font-mono">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ToolBtn icon={<Trash2 size={13} />} label="Clear" onClick={clearCanvas} danger />
        <ToolBtn icon={<Download size={13} />} label="Export" onClick={handleExport} />

        {/* Load */}
        <div className="relative" ref={panelRef}>
          <ToolBtn icon={<FolderOpen size={13} />} label="Load" onClick={() => setShowLoad(!showLoad)} />
          {showLoad && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-panel border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              <p className="px-3 py-2 text-subtle text-[10px] font-mono uppercase tracking-widest border-b border-border">
                Saved Workflows
              </p>
              {savedWorkflows.length === 0 ? (
                <p className="px-3 py-3 text-subtle text-xs text-center">No saved workflows</p>
              ) : (
                savedWorkflows.map((w: SavedWorkflow) => (
                  <button
                    key={w.id}
                    onClick={() => { loadWorkflow(w); setShowLoad(false) }}
                    className="w-full text-left px-3 py-2.5 hover:bg-surface transition-colors border-b border-border/50 last:border-0"
                  >
                    <p className="text-white text-xs font-medium">{w.name}</p>
                    <p className="text-subtle text-[10px] font-mono">
                      {new Date(w.savedAt).toLocaleDateString()} · {(w.nodes as unknown[]).length} nodes
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <ToolBtn
          icon={saved ? <Check size={13} /> : <Save size={13} />}
          label={saved ? 'Saved!' : 'Save'}
          onClick={handleSave}
          highlight={saved}
        />

        <button
          onClick={runWorkflow}
          disabled={isRunning || nodes.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isRunning ? 'rgba(124,106,247,0.3)' : 'rgba(124,106,247,1)',
            boxShadow: isRunning ? 'none' : '0 0 16px rgba(124,106,247,0.4)',
          }}
        >
          <Play size={11} className={isRunning ? 'animate-pulse' : ''} />
          {isRunning ? 'Running…' : 'Run'}
        </button>
      </div>
    </header>
  )
}

function ToolBtn({
  icon, label, onClick, danger, highlight,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
        danger
          ? 'text-red-400 hover:bg-red-500/10'
          : highlight
          ? 'text-emerald-400 bg-emerald-400/10'
          : 'text-subtle hover:text-white hover:bg-surface'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
