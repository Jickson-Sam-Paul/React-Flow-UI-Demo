import { useCallback, useRef, DragEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "../store/workflowStore";
import { WorkflowNodeData, NodeTemplate } from "../types";
import { KIND_COLORS } from "../utils/nodeTemplates";
import WorkflowNode from "./nodes/WorkflowNode";

const nodeTypes = { workflowNode: WorkflowNode };

let idCounter = 1;
const getId = () => `node_${Date.now()}_${idCounter++}`;

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectNode } =
    useWorkflowStore();

  const addNode = useWorkflowStore((s) => s.addNode);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const template: NodeTemplate = JSON.parse(raw);
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = {
        x: e.clientX - bounds.left - 90,
        y: e.clientY - bounds.top - 40,
      };

      const newNode: Node<WorkflowNodeData> = {
        id: getId(),
        type: "workflowNode",
        position,
        data: {
          kind: template.kind,
          label: template.label,
          description: template.description,
          config: { ...template.defaultConfig },
        },
      };
      addNode(newNode);
    },
    [addNode],
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onPaneClick={() => selectNode(null)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#7c6af7", strokeWidth: 2 },
        }}
        style={{ background: "#0a0a0f" }}
      >
        <Panel
          position="top-center"
          className="pointer-events-none mt-3 px-3 w-full flex justify-center"
        >
          <div className="max-w-2xl rounded-xl border border-amber-300/25 bg-panel/90 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.35)] px-4 py-2">
            <p className="text-[11px] font-mono tracking-wide uppercase text-amber-300">
              UI Demo Only
            </p>
            <p className="text-xs text-subtle leading-relaxed">
              This project demonstrates React Flow integration only. No backend,
              API, or workflow execution is included.
            </p>
          </div>
        </Panel>

        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1e1e2e"
        />
        <Controls
          style={{
            background: "#16161f",
            border: "1px solid #1e1e2e",
            borderRadius: 10,
          }}
        />
        <MiniMap
          style={{
            background: "#111118",
            border: "1px solid #1e1e2e",
            borderRadius: 10,
          }}
          nodeColor={(n) => {
            const d = n.data as WorkflowNodeData;
            return KIND_COLORS[d?.kind] ?? "#3a3a4a";
          }}
          maskColor="rgba(10,10,15,0.8)"
        />

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">⬡</div>
              <p className="text-subtle text-sm font-mono">
                Drop nodes here to start building
              </p>
              <p className="text-muted text-xs mt-1">Drag from the sidebar</p>
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}
