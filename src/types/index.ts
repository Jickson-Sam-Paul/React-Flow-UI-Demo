import type { Edge, Node } from '@xyflow/react'

export type NodeKind = 'trigger' | 'action' | 'condition' | 'output'

export interface NodeConfig {
  label: string
  description: string
  [key: string]: string | boolean | number
}

export interface WorkflowNodeData {
  kind: NodeKind
  label: string
  description: string
  config: NodeConfig
  isRunning?: boolean
  isCompleted?: boolean
  hasError?: boolean
  [key: string]: unknown
}

export type WorkflowNode = Node<WorkflowNodeData, 'workflowNode'>

export interface SavedWorkflow {
  id: string
  name: string
  nodes: WorkflowNode[]
  edges: Edge[]
  savedAt: string
}

export interface NodeTemplate {
  kind: NodeKind
  label: string
  description: string
  icon: string
  defaultConfig: NodeConfig
}
