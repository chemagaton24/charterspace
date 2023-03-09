import { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";

const groupSize = 200;
const padding = 20;
const nodeSize = 50;
const initialNodes = [
  {
    id: "1",
    type: "group",
    data: { label: "Group A" },
    position: { x: 0, y: 0 },
    className: "light",
    style: {
      width: groupSize,
      height: groupSize,
      backgroundColor: "rgba(111,203,159, 0.7)",
      padding: 0,
    },
  },
  {
    id: "1a",
    data: { label: "A.1" },
    position: { x: groupSize / 2 - nodeSize / 2, y: padding },
    parentNode: "1",
    style: {
      width: nodeSize,
      height: nodeSize,
      lineHeight: `${nodeSize}px`,
      padding: 0,
    },
  },
  {
    id: "1b",
    data: { label: "B.1" },
    position: { x: padding, y: groupSize - padding - nodeSize },
    parentNode: "1",
    style: {
      width: nodeSize,
      height: nodeSize,
      lineHeight: `${nodeSize}px`,
      padding: 0,
    },
  },
  {
    id: "1c",
    data: { label: "C.1" },
    position: {
      x: groupSize - padding - nodeSize,
      y: groupSize - padding - nodeSize,
    },
    parentNode: "1",
    style: {
      width: nodeSize,
      height: nodeSize,
      lineHeight: `${nodeSize}px`,
      padding: 0,
    },
  },
];

const initialEdges = [
  { id: "e1a-1b", source: "1a", target: "1b" },
  { id: "e1a-1c", source: "1a", target: "1c" },
];

const Flow = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const padding = 20;
        const prev = nds;
        if (changes[0].position) {
          const lowestX = Math.min(...prev.slice(1).map((a) => a.position.x));
          const lowestY = Math.min(...prev.slice(1).map((a) => a.position.y));
          const highestX = Math.max(...prev.slice(1).map((a) => a.position.x));
          const highestY = Math.max(...prev.slice(1).map((a) => a.position.y));

          if (
            lowestX < padding ||
            lowestX > padding ||
            highestX + nodeSize + padding > prev[0].style.width ||
            highestX + nodeSize + padding < prev[0].style.width
          ) {
            prev[0].style = {
              ...prev[0].style,
              left: (padding - lowestX) * -1,
              width: highestX + nodeSize + padding + (padding - lowestX),
            };
          }
          if (
            lowestY < padding ||
            lowestY > padding ||
            highestY + nodeSize + padding > prev[0].style.height ||
            highestY + nodeSize + padding < prev[0].style.height
          ) {
            prev[0].style = {
              ...prev[0].style,
              top: (padding - lowestY) * -1,
              height: highestY + nodeSize + padding + (padding - lowestY),
            };
          }
        }
        return applyNodeChanges(changes, prev);
      });
    },
    [setNodes]
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      className="react-flow-subflows-example"
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default Flow;
