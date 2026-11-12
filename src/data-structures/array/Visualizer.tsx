import React, { useState } from "react";
import { Button } from "@blueprintjs/core/lib/esm";
import MenuDropdown from "@src/components/MenuDropdown";
import Visualizer, { VisualizerRootSVGGElement } from "@src/components/Visualizer";
import styles from "@src/components/Visualizer.scss";
import { Sorter, SortType } from "./sort";
import { MergeSort } from "./sort/merge-sort";
import { QuickSort } from "./sort/quick-sort";

// --- Visual Layout Constants ---
const elementWidth = 60;
const elementHeight = 60;
const elementGap = 20;

interface ArrayItemProps {
  id: string;
  index?: number;
  isComparing?: boolean;
  isSorted?: boolean;
  value: number;
  xPos?: number;
  yPos?: number;
  trackLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

interface ArrayTrackProps {
  index?: number;
  label?: string;
  items: ArrayItemProps[];
}

const ArrayItem: React.FC<ArrayItemProps> = ({ 
  id, 
  index, 
  value, 
  xPos, 
  yPos, 
  trackLabel,
}) => (
  <g key={id} transform={`translate(${xPos}, ${yPos})`}>
    {/* Structural Box Element */}
    <rect
      width={elementWidth}
      height={elementHeight}
      rx={8}
      fill="#ffffff"
      stroke="#3b82f6"
      strokeWidth={2}
      className={styles.arrayNode}
    />

    {index === 0 && trackLabel && (
      <text
        x={-8}
        y={elementHeight / 2 + 5}
        textAnchor="end"
        dominantBaseline="central"
        fontSize={14}
        fill="#333"
      >
        {trackLabel}
      </text>
    )}
    
    {/* Array Value Text */}
    <text
      x={elementWidth / 2}
      y={elementHeight / 2 + 5}
      textAnchor="middle"
      fontWeight="bold"
      fill="#1e293b"
      fontSize="16px"
    >
      {value}
    </text>

    {/* Index Tracking Label */}
    <text
      x={elementWidth / 2}
      y={elementHeight + 20}
      textAnchor="middle"
      fill="#64748b"
      fontSize="12px"
      fontFamily="monospace"
    >
      [{index}]
    </text>
  </g>
);

const ArrayTrack: React.FC<ArrayTrackProps> = ({ index, label, items }) => (
  <>
    {items.map((item, idx) => {
      const xPos = idx * (elementWidth + elementGap);
      const yPos = 100 + ((index ?? 0) * 100); // Baseline height on grid map

      return (
        <ArrayItem {...{ ...item, xPos, yPos, trackLabel: label, index: idx }} />
      );
    })}
  </>
);

export const ArrayVisualizer: React.FC = () => {
  // --- Core State ---
  const [array, setArray] = useState<ArrayItemProps[]>(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: `el-${i}-${Math.random()}`,
      value: Math.floor(Math.random() * 90) + 10,
    }))
  );
  const [arrayIterations, setArrayIterations] = useState<ArrayTrackProps[]>([{ items: array }]);
  const sorter = React.useRef<Sorter<number>>(undefined);

  //   const [inputValue, setInputValue] = useState<string>("");
  //   const [targetIndex, setTargetIndex] = useState<number>(0);

  //   const handlePush = () => {
  //     if (inputValue.trim() === "") return;
  //     const newItem: ArrayItemProps = {
  //       id: Math.random().toString(36).substr(2, 9),
  //       value: isNaN(Number(inputValue)) ? parseInt(inputValue, 10) : Number(inputValue),
  //     };
  //     setArray([...array, newItem]);
  //     setInputValue("");
  //   };

  //   const handlePop = () => {
  //     if (array.length === 0) return;
  //     setArray(array.slice(0, -1));
  //   };

  //   const handleUpdateAt = () => {
  //     if (inputValue.trim() === "" || targetIndex < 0 || targetIndex >= array.length) return;
      
  //     const updatedArray = [...array];
  //     updatedArray[targetIndex] = {
  //       ...updatedArray[targetIndex],
  //       value: isNaN(Number(inputValue)) ? parseInt(inputValue, 10) : Number(inputValue),
  //     };
  //     setArray(updatedArray);
  //     setInputValue("");
  //   };

  // --- Controls & Logic ---
  const randomizeArray = () => {
    setArray(
      Array.from({ length: Math.floor(Math.random() * 10) + 10 }, (_, i) => ({
        id: `el-${i}-${Math.random()}`,
        value: Math.floor(Math.random() * 90) + 10,
      }))
    );
  };

  React.useEffect(() => {
    setArrayIterations([{ items: array }]);
  }, [array]);

  const handleSort = (sortType: SortType) => {
    switch (sortType) {
      case SortType.MergeSort:
        sorter.current = new MergeSort();
        break;
      case SortType.QuickSort:
        sorter.current = new QuickSort();
        break;
    }

    sorter.current.sort(array.map(i => i.value));

    const results = sorter.current.results;
    let iterations: ArrayTrackProps[] = [];

    results.iterations.forEach(iteration => {
      iterations.push({
        label: `${iteration.iteration}: ${iteration.message ?? "Result"}`,
        items: iteration.array.map((value, index) => ({
          index,
          id: `${index + 1}`,
          value: parseInt(value, 10),
        })),
      });
    });

    setArrayIterations(iterations);
  };

  const handleClear = () => {
    setArray([]);
  };

  return (
    <Visualizer
      title="Array Visualizer"
      toolbar={(
        <>
          <Button 
            intent="primary" 
            size="medium" 
            // className={styles.button} 
            onClick={randomizeArray}
          >
            Randomize Array
          </Button>
          <Button
            intent="primary" 
            size="medium" 
            // className={styles.button} 
            onClick={handleClear}
          >
            Clear
          </Button>
          <MenuDropdown
            text="Sort"
            menuItems={Object.entries(SortType).map(([key, value]) => ({
              text: key,
              onClick: () => handleSort(value),
            }))}
          />
        </>
      )}
    >
      {/* Transform Group: Houses layout elements inside local matrix coordinates */}
      {({ transform }) => (
        <VisualizerRootSVGGElement {...{ transform }}>
          {arrayIterations.map((iteration, idx) => (
            <ArrayTrack {...iteration} index={idx} />
          ))}
        </VisualizerRootSVGGElement>
      )}
    </Visualizer>
  );
};
