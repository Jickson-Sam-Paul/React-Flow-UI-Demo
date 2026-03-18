import { memo, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNode as WorkflowGraphNode } from '../../types'
import { KIND_COLORS } from '../../utils/nodeTemplates'
import { useWorkflowStore } from '../../store/workflowStore'

const kindBg: Record<string, string> = {
  trigger: 'rgba(249,115,22,0.08)',
  action: 'rgba(124,106,247,0.08)',
  condition: 'rgba(16,185,129,0.08)',
  output: 'rgba(236,72,153,0.08)',
}

const icons: Record<string, string> = {
  trigger: '⚡',
  action: '⚙',
  condition: '◈',
  output: '◎',
}

function WorkflowNode({ id, data, selected }: NodeProps<WorkflowGraphNode>) {
  const nodeData = data
  const selectNode = useWorkflowStore((s) => s.selectNode)
  const color = KIND_COLORS[nodeData.kind]

  const handleClick = useCallback(() => selectNode(id), [id, selectNode])

  const statusRing = nodeData.isRunning
    ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-[#0a0a0f]'
    : nodeData.isCompleted
    ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-[#0a0a0f]'
    : nodeData.hasError
    ? 'ring-2 ring-red-400 ring-offset-1 ring-offset-[#0a0a0f]'
    : selected
    ? 'ring-2 ring-offset-1 ring-offset-[#0a0a0f]'
    : ''

  return (
    <div
      onClick={handleClick}
      className={`relative min-w-[180px] rounded-xl border transition-all duration-200 cursor-pointer select-none ${statusRing}`}
      style={{
        background: kindBg[nodeData.kind],
        borderColor: selected ? color : 'rgba(255,255,255,0.08)',
        boxShadow: selected ? `0 0 0 1px ${color}22, 0 8px 32px ${color}18` : '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top handle */}
      {nodeData.kind !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: color, border: '2px solid #0a0a0f', width: 10, height: 10, top: -5 }}
        />
      )}

      {/* Header strip */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-xl"
        style={{ borderBottom: `1px solid ${color}22`, background: `${color}12` }}
      >
        <span className="text-sm">{icons[nodeData.kind]}</span>
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color }}>
          {nodeData.kind}
        </span>
        {nodeData.isRunning && (
          <span className="ml-auto flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
          </span>
        )}
        {nodeData.isCompleted && <span className="ml-auto text-emerald-400 text-xs">✓</span>}
        {nodeData.hasError && <span className="ml-auto text-red-400 text-xs">✗</span>}
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <p className="text-white text-sm font-medium leading-tight">{nodeData.label}</p>
        <p className="text-[#6b6b80] text-[11px] mt-0.5 leading-tight">{nodeData.description}</p>
      </div>

      {/* Bottom handle */}
      {nodeData.kind !== 'output' && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: color, border: '2px solid #0a0a0f', width: 10, height: 10, bottom: -5 }}
        />
      )}
    </div>
  )
}

export default memo(WorkflowNode)
