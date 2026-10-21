import React from 'react';

// === TypeScript Interfaces ===
interface VertexProps {
  id: string;
  label: string;
  x: number;
  y: number;
  edgeSourceVertexId: string | null;
  handleVertexMouseDown: (e: React.MouseEvent<Element, MouseEvent>, vertexId: string) => void;
  handleVertexMouseUp: (e: React.MouseEvent<Element, MouseEvent>, targetId: string) => void;
  mode: InteractionMode;
}

interface EdgeProps {
  id: string;
  sourceId: string;
  targetId: string;
  lineProps?: React.SVGLineElementAttributes<SVGLineElement>;
}

type InteractionMode = "selectOrDrag" | "addVertex" | "addEdge";
enum InteractionModeEnum {
  SelectOrDrag = "selectOrDrag",
  AddVertex = "addVertex",
  AddEdge = "addEdge",
}

const Vertex: React.FC<VertexProps> = ({
  id,
  x,
  y,
  edgeSourceVertexId,
  handleVertexMouseDown,
  handleVertexMouseUp,
  label,
  mode,
}) => {
  return (
    <g
      key={id}
      transform={`translate(${x}, ${y})`}
      onMouseDown={(e) => handleVertexMouseDown(e, id)}
      onMouseUp={(e) => handleVertexMouseUp(e, id)}
      style={{ cursor: mode === InteractionModeEnum.AddEdge ? 'cell' : 'grab' }}
    >
      <circle
        r="20"
        fill={edgeSourceVertexId === id ? '#ffc107' : '#007bff'}
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

const Edge: React.FC<Omit<EdgeProps, "id" | "sourceId" | "targetId">> = ({ lineProps }) => (
  <line {...lineProps} />
);

export const GraphVisualizer: React.FC = () => {
  // === State Management ===
  const [vertices, setVertices] = React.useState<Omit<VertexProps, "edgeSourceVertexId" | "handleVertexMouseDown" | "handleVertexMouseUp" | "mode">[]>([
    { id: '1', label: 'A', x: 150, y: 200 },
    { id: '2', label: 'B', x: 350, y: 150 },
    { id: '3', label: 'C', x: 250, y: 350 },
  ]);
  const [edges, setEdges] = React.useState<EdgeProps[]>([
    { id: 'e1', sourceId: '1', targetId: '2' },
    { id: 'e2', sourceId: '2', targetId: '3' },
  ]);

  const [mode, setMode] = React.useState<InteractionMode>(InteractionModeEnum.SelectOrDrag);
  
  // Interaction Tracking
  const [draggedVertexId, setDraggedVertexId] = React.useState<string | null>(null);
  const [edgeSourceVertexId, setEdgeSourceVertexId] = React.useState<string | null>(null);
  const [cursorPos, setCursorPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs for tracking SVG canvas coordinates
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const vertexCounter = React.useRef<number>(4);

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
  
  // Canvas Click (Add Vertex Mode)
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== InteractionModeEnum.AddVertex) return;
    
    // Ensure we aren't clicking an existing vertex element
    if ((e.target as HTMLElement).tagName !== 'svg') return;

    const coords = getMouseCoords(e);
    const newVertex: Omit<VertexProps, "edgeSourceVertexId" | "handleVertexMouseDown" | "handleVertexMouseUp" | "mode"> = {
      id: String(vertexCounter.current),
      label: String.fromCharCode(64 + vertexCounter.current), // Generates D, E, F...
      x: coords.x,
      y: coords.y,
    };

    setVertices((prev) => [...prev, newVertex]);
    vertexCounter.current += 1;
  };

  // Vertex Drag or Edge Draw Start
  const handleVertexMouseDown = (e: React.MouseEvent, vertexId: string) => {
    e.stopPropagation(); // Prevent canvas triggers
    
    if (mode === InteractionModeEnum.SelectOrDrag) {
      setDraggedVertexId(vertexId);
    } else if (mode === InteractionModeEnum.AddEdge) {
      setEdgeSourceVertexId(vertexId);
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

    if (mode === InteractionModeEnum.SelectOrDrag && draggedVertexId) {
      setVertices((prevVertices) =>
        prevVertices.map((vertex) =>
          vertex.id === draggedVertexId ? { ...vertex, x: coords.x, y: coords.y } : vertex
        )
      );
    } else if (mode === InteractionModeEnum.AddEdge && edgeSourceVertexId) {
      setCursorPos({ x: coords.x, y: coords.y });
    }
  };

  // Global Canvas Mouse Up (Ends Actions)
  const handleCanvasMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    setDraggedVertexId(null);
    setEdgeSourceVertexId(null);
  };

  // Vertex Mouse Up (Completes Edge Connection)
  const handleVertexMouseUp = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    
    if (mode === InteractionModeEnum.AddEdge && edgeSourceVertexId && edgeSourceVertexId !== targetId) {
      // Avoid duplicate edges
      const edgeExists = edges.some(
        (edge) =>
          (edge.sourceId === edgeSourceVertexId && edge.targetId === targetId) ||
          (edge.sourceId === targetId && edge.targetId === edgeSourceVertexId)
      );

      if (!edgeExists) {
        const newEdge: EdgeProps = {
          id: `e-${edgeSourceVertexId}-${targetId}`,
          sourceId: edgeSourceVertexId,
          targetId: targetId,
        };
        setEdges((prev) => [...prev, newEdge]);
      }
    }
    setEdgeSourceVertexId(null);
  };

  const clearCanvas = () => {
    setVertices([]);
    setEdges([]);
    vertexCounter.current = 1;
  };

  // Find source vertex for edge preview styling
  const sourceVertex = vertices.find((n) => n.id === edgeSourceVertexId);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px' }}>
      <h2>Custom Graph Visualizer</h2>
      
      {/* Control Panel Toolbar */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { setMode(InteractionModeEnum.SelectOrDrag); setEdgeSourceVertexId(null); }}
          style={{
            padding: '8px 12px',
            backgroundColor: mode === InteractionModeEnum.SelectOrDrag ? '#007bff' : '#f0f0f0',
            color: mode === InteractionModeEnum.SelectOrDrag ? '#fff' : '#000',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          🖐️ Drag Vertices
        </button>
        <button
          onClick={() => { setMode(InteractionModeEnum.AddVertex); setEdgeSourceVertexId(null); }}
          style={{
            padding: '8px 12px',
            backgroundColor: mode === InteractionModeEnum.AddVertex ? '#28a745' : '#f0f0f0',
            color: mode === InteractionModeEnum.AddVertex ? '#fff' : '#000',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          ➕ Add Vertices
        </button>
        <button
          onClick={() => setMode(InteractionModeEnum.AddEdge)}
          style={{
            padding: '8px 12px',
            backgroundColor: mode === InteractionModeEnum.AddEdge ? '#ffc107' : '#f0f0f0',
            color: mode === InteractionModeEnum.AddEdge ? '#fff' : '#000',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          🔗 Connect Vertices
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
          cursor: mode === InteractionModeEnum.AddVertex ? 'crosshair' : 'default',
          userSelect: 'none',
        }}
      >
        {/* Render Graph Static Edges */}
        {edges.map((edge) => {
          const fromVertex = vertices.find((n) => n.id === edge.sourceId);
          const toVertex = vertices.find((n) => n.id === edge.targetId);
          
          if (!fromVertex || !toVertex) return null;

          return (
            <Edge 
              lineProps={{
                key: edge.id,
                x1: fromVertex.x,
                y1: fromVertex.y,
                x2: toVertex.x,
                y2: toVertex.y,
                stroke: "#999",
                strokeWidth: "3",
              }} 
            />
          );
        })}

        {/* Dynamic Edge Drawing Preview Connection */}
        {mode === InteractionModeEnum.AddEdge && sourceVertex && (
          <Edge
            lineProps={{
              x1: sourceVertex.x,
              y1: sourceVertex.y,
              x2: cursorPos.x,
              y2: cursorPos.y,
              stroke: "#ffc107",
              strokeWidth: '3',
              strokeDasharray: "5,5",
            }}
          />
        )}

        {/* Render Graph Interactive Vertices */}
        {vertices.map((vertex) => (
          <Vertex
            {...{
              ...vertex,
              edgeSourceVertexId,
              handleVertexMouseDown,
              handleVertexMouseUp,
              mode,
            }}
          />
        ))}
      </svg>
      
      {/* Help Instructions Footer */}
      <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
        {mode === InteractionModeEnum.SelectOrDrag && '💡 Click and drag any vertex to reposition it on the canvas.'}
        {mode === InteractionModeEnum.AddVertex && '💡 Click anywhere on the blank canvas area to deploy a new vertex.'}
        {mode === InteractionModeEnum.AddEdge && '💡 Drag from one vertex to another to construct a connecting structural edge.'}
      </div>
    </div>
  );
};
