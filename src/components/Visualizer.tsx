import React from "react";
import styles from "./Visualizer.scss";
import { LinkButton } from "./LinkButton";

export interface ViewTransformProps {
  canvasContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
  dragStart?: React.MutableRefObject<{
    x: number;
    y: number;
  }>;
  isDragging?: boolean;
  isPanning?: boolean;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPanning?: React.Dispatch<React.SetStateAction<boolean>>;
  setTransform?: React.Dispatch<React.SetStateAction<TransformState>>;  
  transform?: TransformState;
}

export interface VisualizerProps {
  children?: React.ReactNode | ((props: ViewTransformProps) => React.ReactNode);
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUpOrLeave?: React.MouseEventHandler<HTMLDivElement>;
  onWheel?: React.WheelEventHandler<HTMLDivElement>;
  title: React.ReactNode;
  toolbar?: React.ReactElement | ((props: ViewTransformProps) => React.ReactElement);
}

export interface TransformState {
  x: number;
  y: number;
  scale: number;
}

export interface VisualizerRootSVGGElementProps extends Omit<React.SVGAttributes<SVGGElement>, "transform"> {
  transform?: TransformState;
}

export const VisualizerRootSVGGElement: React.FC<VisualizerRootSVGGElementProps> = ({ transform, children, ...props}) => (
  <g transform={`translate(${transform?.x}, ${transform?.y}) scale(${transform?.scale})`} {...props}>
    {children}
  </g>
);

const Visualizer: React.FC<VisualizerProps> = ({
  children,
  onMouseDown,
  onMouseMove,
  onMouseUpOrLeave,
  onWheel,
  title,
  toolbar,
}) => {
  const [viewportSize, setViewportSize] = React.useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });
  const [transform, setTransform] = React.useState<TransformState>({ x: 50, y: 50, scale: 1 });
  const [isPanning, setIsPanning] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const dragStart = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasContainerRef = React.useRef<HTMLDivElement | null>(null);

  // --- Track ONLY the Canvas Wrapper Container Size ---
  React.useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setViewportSize({ width, height });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // --- Prevent Browser Page Zoom When Scrolling Inside the Canvas Wrapper ---
  React.useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const preventNativeScroll = (e: WheelEvent) => {
      e.preventDefault();
    };

    // Passive: false is required to reliably lock wheel zoom to this container only
    container.addEventListener("wheel", preventNativeScroll, { passive: false });
    return () => container.removeEventListener("wheel", preventNativeScroll);
  }, []);

  const resetZoom = () => {
    setTransform({ x: 50, y: 50, scale: 1 });
  };

  // --- Zoom Mechanics via Mouse Wheel ---
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // e.preventDefault();

    if (!canvasContainerRef.current) return;

    // Get cursor position relative to the SVG canvas
    const rect = canvasContainerRef.current.getBoundingClientRect(); // = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom scalar variables
    const zoomFactor = 1.1;
    const nextScale = e.deltaY < 0 ? transform.scale * zoomFactor : transform.scale / zoomFactor;
    
    // Enforce reasonable bounds [0.2x min zoom, 5x max zoom]
    const boundedScale = Math.min(Math.max(nextScale, 0.2), 3); // = Math.min(Math.max(nextScale, 0.2), 5);

    // Zoom relative to the point under mouse cursor position
    const xs = (mouseX - transform.x) / transform.scale;
    const ys = (mouseY - transform.y) / transform.scale;

    setTransform({
      x: mouseX - xs * boundedScale,
      y: mouseY - ys * boundedScale,
      scale: boundedScale,
    });
  };

  // --- Pan Mechanics via Right-Click or Middle-Click Drag ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Enable panning on Right-click (2) or Middle-click (1) or Left-click if space key is preferred
    if (e.button === 0 || e.button === 1 || e.button === 2) {
      if (e.button === 2) e.preventDefault(); // Prevent standard browser context menu on right click
      setIsDragging(true);
      setIsPanning(true);
      dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasContainerRef.current) return;

    if (!isPanning) return;
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }));
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
    setIsDragging(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.info}>
          <span>Zoom: {Math.round(transform.scale * 100)}%</span>
          <span style={{ marginLeft: "10px" }}>Drag Canvas to Pan</span>
          <span style={{ marginLeft: "10px" }}>
            <LinkButton onClick={resetZoom}>Reset</LinkButton>
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          padding: "12px 24px",
        }}
      >
        {toolbar !== undefined
          ? typeof toolbar === "function"
            ? toolbar({
                canvasContainerRef,
                dragStart,
                isDragging,
                isPanning,
                setIsDragging,
                setIsPanning,
                setTransform,
                transform,
            })
            : toolbar
          : undefined}
      </div>
      {/* Interactive Infinite Canvas viewport */}
      <div
        ref={canvasContainerRef}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onWheel={onWheel ?? handleWheel}
        onMouseDown={onMouseDown ?? handleMouseDown}
        onMouseMove={onMouseMove ?? handleMouseMove}
        onMouseUp={onMouseUpOrLeave ?? handleMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave ?? handleMouseUpOrLeave}
        onContextMenu={(e) => e.preventDefault()} // Disable right click pop up menu inside workspace
      >
        <svg
          className={styles.svgViewport}
          width={viewportSize.width}
          height={viewportSize.height}
          viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
        >
          {children !== undefined
            ? typeof children === "function"
              ? children({
                  canvasContainerRef,
                  dragStart,
                  isDragging,
                  isPanning,
                  setIsDragging,
                  setIsPanning,
                  setTransform,
                  transform,
              })
              : children
            : undefined}
        </svg>
      </div>
    </div>
  );
};

export default Visualizer;