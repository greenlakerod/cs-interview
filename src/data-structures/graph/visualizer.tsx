import React from 'react';

// === TypeScript Interfaces ===
interface VertexProps {
  id: string;
  label: string;
  x: number;
  y: number;
  edgeSourceNodeId: string | null;
  handleNodeMouseDown: (e: React.MouseEvent<Element, MouseEvent>, nodeId: string) => void;
  handleNodeMouseUp: (e: React.MouseEvent<Element, MouseEvent>, targetId: string) => void;
  mode: InteractionMode;
}

interface EdgeProps {
  id: string;
  sourceId: string;
  targetId: string;
}

type InteractionMode = 'selectOrDrag' | 'addNode' | 'addEdge';

const Vertex: React.FC<VertexProps> = ({
  id,
  x,
  y,
  edgeSourceNodeId,
  handleNodeMouseDown,
  handleNodeMouseUp,
  label,
  mode,
}) => {
  return (
    <g
      key={id}
      transform={`translate(${x}, ${y})`}
      onMouseDown={(e) => handleNodeMouseDown(e, id)}
      onMouseUp={(e) => handleNodeMouseUp(e, id)}
      style={{ cursor: mode === 'addEdge' ? 'cell' : 'grab' }}
    >
      <circle
        r="20"
        fill={edgeSourceNodeId === id ? '#ffc107' : '#007bff'}
        stroke="#fff"
        strokeWidth="2"
        style={{
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))',
          transition: 'fill 0.1s ease',
        }}
      />
      <text
        textAnchor="middle"
        dy=".3em"
        fill="#fff"
        style={{ fontWeight: 'bold', fontSize: '14px', pointerEvents: 'none' }}
      >
        {label}
      </text>
    </g>
  );
};

export const GraphVisualizer: React.FC = () => {
  // === State Management ===
  const [vertices, setVertices] = React.useState<Omit<VertexProps, "edgeSourceNodeId" | "handleNodeMouseDown" | "handleNodeMouseUp" | "mode">[]>([
    { id: '1', label: 'A', x: 150, y: 200 },
    { id: '2', label: 'B', x: 350, y: 150 },
    { id: '3', label: 'C', x: 250, y: 350 },
  ]);
  const [edges, setEdges] = React.useState<EdgeProps[]>([
    { id: 'e1', sourceId: '1', targetId: '2' },
    { id: 'e2', sourceId: '2', targetId: '3' },
  ]);

  const [mode, setMode] = React.useState<InteractionMode>('selectOrDrag');
  
  // Interaction Tracking
  const [draggedNodeId, setDraggedNodeId] = React.useState<string | null>(null);
  const [edgeSourceNodeId, setEdgeSourceNodeId] = React.useState<string | null>(null);
  const [cursorPos, setCursorPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs for tracking SVG canvas coordinates
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const nodeCounter = React.useRef<number>(4);

  // === Helper: Get Mouse Relative SVG Coordinates ===
  const getMouseCoords = (e: React.MouseEvent<SVGSVGElement>): { x: number; y: number } => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // === Event Handlers ===
  
  // Canvas Click (Add Node Mode)
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'addNode') return;
    
    // Ensure we aren't clicking an existing node element
    if ((e.target as HTMLElement).tagName !== 'svg') return;

    const coords = getMouseCoords(e);
    const newNode: Omit<VertexProps, "edgeSourceNodeId" | "handleNodeMouseDown" | "handleNodeMouseUp" | "mode"> = {
      id: String(nodeCounter.current),
      label: String.fromCharCode(64 + nodeCounter.current), // Generates D, E, F...
      x: coords.x,
      y: coords.y,
    };

    setVertices((prev) => [...prev, newNode]);
    nodeCounter.current += 1;
  };

  // Node Drag or Edge Draw Start
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation(); // Prevent canvas triggers
    
    if (mode === 'selectOrDrag') {
      setDraggedNodeId(nodeId);
    } else if (mode === 'addEdge') {
      setEdgeSourceNodeId(nodeId);
      if (svgRef.current) {
        // Initialize dynamic preview line position
        const rect = svgRef.current.getBoundingClientRect();
        setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    }
  };

  // Global Canvas Mouse Move (Updates Dragging or Edge Preview)
  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getMouseCoords(e);

    if (mode === 'selectOrDrag' && draggedNodeId) {
      setVertices((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggedNodeId ? { ...node, x: coords.x, y: coords.y } : node
        )
      );
    } else if (mode === 'addEdge' && edgeSourceNodeId) {
      setCursorPos({ x: coords.x, y: coords.y });
    }
  };

  // Global Canvas Mouse Up (Ends Actions)
  const handleCanvasMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    setDraggedNodeId(null);
    setEdgeSourceNodeId(null);
  };

  // Node Mouse Up (Completes Edge Connection)
  const handleNodeMouseUp = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    
    if (mode === 'addEdge' && edgeSourceNodeId && edgeSourceNodeId !== targetId) {
      // Avoid duplicate edges
      const edgeExists = edges.some(
        (edge) =>
          (edge.sourceId === edgeSourceNodeId && edge.targetId === targetId) ||
          (edge.sourceId === targetId && edge.targetId === edgeSourceNodeId)
      );

      if (!edgeExists) {
        const newEdge: EdgeProps = {
          id: `e-${edgeSourceNodeId}-${targetId}`,
          sourceId: edgeSourceNodeId,
          targetId: targetId,
        };
        setEdges((prev) => [...prev, newEdge]);
      }
    }
    setEdgeSourceNodeId(null);
  };

  const clearCanvas = () => {
    setVertices([]);
    setEdges([]);
    nodeCounter.current = 1;
  };

  // Find source node for edge preview styling
  const sourceNode = vertices.find((n) => n.id === edgeSourceNodeId);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px' }}>
      <h2>Custom Graph Visualizer</h2>
      
      {/* Control Panel Toolbar */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { setMode('selectOrDrag'); setEdgeSourceNodeId(null); }}
          style={{
            padding: '8px 12px',
            backgroundColor: mode === 'selectOrDrag' ? '#007bff' : '#f0f0f0',
            color: mode === 'selectOrDrag' ? '#fff' : '#000',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          🖐️ Drag Nodes
        </button>
        <button
          onClick={() => { setMode('addNode'); setEdgeSourceNodeId(null); }}
          style={{
            padding: '8px 12px',
            backgroundColor: mode === 'addNode' ? '#28a745' : '#f0f0f0',
            color: mode === 'addNode' ? '#fff' : '#000',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          ➕ Add Nodes
        </button>
        <button
          onClick={() => setMode('addEdge')}
          style={{
            padding: '8px 12px',
            backgroundColor: mode === 'addEdge' ? '#ffc107' : '#f0f0f0',
            color: mode === 'addEdge' ? '#fff' : '#000',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          🔗 Connect Nodes
        </button>
        <button
          onClick={clearCanvas}
          style={{
            padding: '8px 12px', backgroundColor: '#dc3545', color: '#fff',
            border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto'
          }}
        >
          🗑️ Clear Graph
        </button>
      </div>

      {/* SVG Interaction Canvas */}
      <svg
        ref={svgRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        style={{
          width: '100%',
          height: '500px',
          border: '2px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
          cursor: mode === 'addNode' ? 'crosshair' : 'default',
          userSelect: 'none',
        }}
      >
        {/* Render Graph Static Edges */}
        {edges.map((edge) => {
          const fromNode = vertices.find((n) => n.id === edge.sourceId);
          const toNode = vertices.find((n) => n.id === edge.targetId);
          
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={edge.id}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#999"
              strokeWidth="3"
            />
          );
        })}

        {/* Dynamic Edge Drawing Preview Connection */}
        {mode === 'addEdge' && sourceNode && (
          <line
            x1={sourceNode.x}
            y1={sourceNode.y}
            x2={cursorPos.x}
            y2={cursorPos.y}
            stroke="#ffc107"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        )}

        {/* Render Graph Interactive Nodes */}
        {vertices.map((vertex) => (
          <Vertex
            {...{
              ...vertex,
              edgeSourceNodeId,
              handleNodeMouseDown,
              handleNodeMouseUp,
              mode,
            }}
          />
        ))}
      </svg>
      
      {/* Help Instructions Footer */}
      <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
        {mode === 'selectOrDrag' && '💡 Click and drag any node to reposition it on the canvas.'}
        {mode === 'addNode' && '💡 Click anywhere on the blank canvas area to deploy a new vertex node.'}
        {mode === 'addEdge' && '💡 Drag from one node to another to construct a connecting structural edge.'}
      </div>
    </div>
  );
};
