import { useState, DragEvent } from 'react'
import { NODE_TEMPLATES, KIND_COLORS, KIND_LABELS } from '../utils/nodeTemplates'
import { NodeTemplate, NodeKind } from '../types'

const kinds: NodeKind[] = ['trigger', 'action', 'condition', 'output']

export default function Sidebar() {
  const [activeKind, setActiveKind] = useState<NodeKind | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = NODE_TEMPLATES.filter((t) => {
    const matchKind = activeKind === 'all' || t.kind === activeKind
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase())
    return matchKind && matchSearch
  })

  const onDragStart = (e: DragEvent, template: NodeTemplate) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(template))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-[220px] flex flex-col h-full bg-panel border-r border-border">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-mono font-bold">F</div>
          <span className="text-white font-medium text-sm tracking-wide">FlowCraft</span>
        </div>
        <p className="text-subtle text-[10px] mt-1 font-mono">Visual Workflow Builder</p>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search nodes..."
          className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-subtle outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Filter tabs */}
      <div className="px-3 pt-2 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveKind('all')}
          className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors ${activeKind === 'all' ? 'bg-muted text-white' : 'text-subtle hover:text-white'}`}
        >
          All
        </button>
        {kinds.map((k) => (
          <button
            key={k}
            onClick={() => setActiveKind(k)}
            className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors ${activeKind === k ? 'text-white' : 'text-subtle hover:text-white'}`}
            style={activeKind === k ? { background: `${KIND_COLORS[k]}33`, color: KIND_COLORS[k] } : {}}
          >
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4 space-y-1 scrollbar-thin">
        {filtered.map((template) => (
          <div
            key={`${template.kind}-${template.label}`}
            draggable
            onDragStart={(e) => onDragStart(e, template)}
            className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-transparent hover:border-border cursor-grab active:cursor-grabbing transition-all duration-150 hover:bg-surface"
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: `${KIND_COLORS[template.kind]}18`, border: `1px solid ${KIND_COLORS[template.kind]}30` }}
            >
              {template.icon}
            </div>
            <div className="min-w-0">
              <p className="text-white text-[11px] font-medium leading-tight truncate">{template.label}</p>
              <p className="text-subtle text-[10px] leading-tight truncate">{template.description}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-subtle text-[11px] text-center pt-4">No nodes found</p>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-subtle text-[10px] font-mono leading-relaxed">
          Drag nodes onto the canvas to build your workflow
        </p>
      </div>
    </aside>
  )
}
