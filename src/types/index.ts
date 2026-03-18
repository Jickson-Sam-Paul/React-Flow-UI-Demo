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
}

export interface SavedWorkflow {
  id: string
  name: string
  nodes: unknown[]
  edges: unknown[]
  savedAt: string
}

export interface NodeTemplate {
  kind: NodeKind
  label: string
  description: string
  icon: string
  defaultConfig: NodeConfig
}
