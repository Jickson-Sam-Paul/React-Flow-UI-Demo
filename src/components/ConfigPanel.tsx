import { useCallback } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useWorkflowStore } from '../store/workflowStore'
import { KIND_COLORS } from '../utils/nodeTemplates'

export default function ConfigPanel() {
  const { nodes, selectedNodeId, selectNode, updateNodeConfig, deleteNode } = useWorkflowStore()
  const node = nodes.find((n) => n.id === selectedNodeId)

  const handleClose = useCallback(() => selectNode(null), [selectNode])
  const handleDelete = useCallback(() => {
    if (selectedNodeId) deleteNode(selectedNodeId)
  }, [selectedNodeId, deleteNode])

  if (!node) return null

  const { data } = node
  const color = KIND_COLORS[data.kind]

  const handleChange = (key: string, value: string) => {
    if (key === 'label' || key === 'description') {
      updateNodeConfig(node.id, { [key]: value })
    } else {
      updateNodeConfig(node.id, { config: { ...data.config, [key]: value } })
    }
  }

  const configFields = Object.entries(data.config).filter(([k]) => k !== 'label' && k !== 'description')

  return (
    <aside className="w-[260px] flex flex-col h-full bg-panel border-l border-border animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-white text-sm font-medium">Configure Node</span>
        </div>
        <button onClick={handleClose} className="text-subtle hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Kind badge */}
      <div className="px-4 pt-3">
        <span
          className="inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md"
          style={{ background: `${color}20`, color }}
        >
          {data.kind}
        </span>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <Field label="Label" value={data.label} onChange={(v) => handleChange('label', v)} />
        <Field label="Description" value={data.description} onChange={(v) => handleChange('description', v)} multiline />

        {configFields.length > 0 && (
          <>
            <div className="border-t border-border pt-3">
              <p className="text-subtle text-[10px] font-mono uppercase tracking-widest mb-3">Configuration</p>
              <div className="space-y-3">
                {configFields.map(([key, val]) => (
                  <Field
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                    value={String(val)}
                    onChange={(v) => handleChange(key, v)}
                    mono
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete */}
      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-500/20 text-red-400 text-xs hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={12} />
          Delete node
        </button>
      </div>
    </aside>
  )
}

function Field({
  label, value, onChange, multiline, mono,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  mono?: boolean
}) {
  return (
    <div>
      <label className="block text-subtle text-[10px] font-mono uppercase tracking-widest mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={`w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent transition-colors resize-none ${mono ? 'font-mono' : ''}`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent transition-colors ${mono ? 'font-mono' : ''}`}
        />
      )}
    </div>
  )
}
