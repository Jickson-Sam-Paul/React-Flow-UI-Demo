import { create } from 'zustand'
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'
import { WorkflowNodeData, SavedWorkflow, WorkflowNode } from '../types'

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: Edge[]
  selectedNodeId: string | null
  isRunning: boolean
  workflowName: string
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  selectNode: (id: string | null) => void
  updateNodeConfig: (id: string, config: Partial<WorkflowNodeData>) => void
  addNode: (node: WorkflowNode) => void
  deleteNode: (id: string) => void
  runWorkflow: () => Promise<void>
  saveWorkflow: () => void
  loadWorkflow: (workflow: SavedWorkflow) => void
  setWorkflowName: (name: string) => void
  clearCanvas: () => void
  getSavedWorkflows: () => SavedWorkflow[]
}

const STORAGE_KEY = 'flowcraft_workflows'

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isRunning: false,
  workflowName: 'Untitled Workflow',

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge({ ...connection, animated: true, style: { stroke: '#7c6af7', strokeWidth: 2 } }, state.edges),
    })),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeConfig: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  runWorkflow: async () => {
    const { nodes, edges } = get()
    if (nodes.length === 0) return

    set({ isRunning: true })

    // Build execution order via topological sort
    const adj = new Map<string, string[]>()
    const inDegree = new Map<string, number>()

    nodes.forEach((n) => { adj.set(n.id, []); inDegree.set(n.id, 0) })
    edges.forEach((e) => {
      adj.get(e.source)?.push(e.target)
      inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1)
    })

    const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id)
    const order: string[] = []
    while (queue.length) {
      const id = queue.shift()!
      order.push(id)
      for (const neighbor of adj.get(id) ?? []) {
        inDegree.set(neighbor, (inDegree.get(neighbor) ?? 1) - 1)
        if (inDegree.get(neighbor) === 0) queue.push(neighbor)
      }
    }

    // Reset states
    set((state) => ({
      nodes: state.nodes.map((n) => ({ ...n, data: { ...n.data, isRunning: false, isCompleted: false, hasError: false } })),
    }))

    // Animate execution
    for (const id of order) {
      set((state) => ({
        nodes: state.nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, isRunning: true } } : n),
      }))
      await new Promise((r) => setTimeout(r, 800))
      const hasError = get().nodes.find((n) => n.id === id)?.data.kind === 'condition' && Math.random() > 0.7
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, isRunning: false, isCompleted: !hasError, hasError } } : n
        ),
      }))
      await new Promise((r) => setTimeout(r, 200))
    }

    set({ isRunning: false })
  },

  saveWorkflow: () => {
    const { nodes, edges, workflowName } = get()
    const saved: SavedWorkflow = {
      id: Date.now().toString(),
      name: workflowName,
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    }
    const existing = get().getSavedWorkflows()
    const updated = [saved, ...existing].slice(0, 10)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  },

  loadWorkflow: (workflow) => {
    set({
      nodes: workflow.nodes,
      edges: workflow.edges,
      workflowName: workflow.name,
      selectedNodeId: null,
    })
  },

  setWorkflowName: (name) => set({ workflowName: name }),

  clearCanvas: () => set({ nodes: [], edges: [], selectedNodeId: null }),

  getSavedWorkflows: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as SavedWorkflow[]
    } catch {
      return []
    }
  },
}))
