import React from "react";
import { LinkedList } from ".";
import styles from "./visualizer.scss";

// enum ListOperation {
//   Insert = "insert",
//   Remove = "remove",
// }

enum InsertOperation {
  Head = "head",
  Tail = "tail",
  Index = "index",
}

interface NodeProps {
  index: number;
  value: any;
  isHead: boolean;
  isTail: boolean;
}

const Node: React.FC<NodeProps> = ({ index, value, isHead, isTail }: NodeProps) => (
  <React.Fragment key={index}>
    {/* Node Container containing labels + structural node box */}
    <div className={styles.nodeWrapper}>
      {/* Floating Pointer Head Indicator */}
      {isHead && <div className={styles.headPointerTag}>HEAD ⬇</div>}
      
      <div className={styles.node}>
        <div className={styles.nodeData}>{value}</div>
        <div className={styles.nodeNext}>
          {isTail ? 'NULL' : '•next'}
        </div>
      </div>

      {/* Floating Pointer Tail Indicator */}
      {isTail && <div className={styles.tailPointerTag}>⬆ TAIL</div>}
    </div>
    
    {/* Connected structural arrow */}
    {!isTail && (
      <div className={styles.arrow}>➔</div>
    )}
  </React.Fragment>  
);

interface InsertionControlsProps {
  linkedList: React.MutableRefObject<LinkedList<number>>;
  setListData: React.Dispatch<React.SetStateAction<number[]>>;
}

const InsertionControls: React.FC<InsertionControlsProps> = (
  {
    linkedList,
    setListData,
  }: InsertionControlsProps,
) => {
  const [insertValue, setInsertValue] = React.useState(10);
  const [insertIndex, setInsertIndex] = React.useState(0);

  const updateValueInput = (e: React.ChangeEvent<HTMLInputElement>): void => setInsertValue(parseInt(e.target.value));
  const updateIndexInput = (e: React.ChangeEvent<HTMLInputElement>): void => setInsertIndex(parseInt(e.target.value));

  const executeInsertion = (insertionType: InsertOperation) => {
    const numericValue = Number(insertValue);
    if (isNaN(numericValue)) {
      alert("Please enter a valid numeric value");
      return;
    }

    try {
      switch (insertionType) {
        case InsertOperation.Head:
          linkedList.current.addFirst(numericValue);
          break;
        case InsertOperation.Tail:
          linkedList.current.addLast(numericValue);
          break;
        case InsertOperation.Index:
          linkedList.current.add(numericValue, insertIndex);
        default:
          break;
      }

      if (linkedList.current) {
        setListData(linkedList.current.values);
      }
    } catch (err) {
      console.error("Memory reference layout failure: ", err);
    }
  };

  return (
    <React.Fragment>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Value</label>
        <input 
          type="number" 
          value={insertValue} 
          onChange={updateValueInput} 
          className={styles.input}
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>Index</label>
        <input 
          type="number" 
          value={insertIndex} 
          min="0"
          onChange={updateIndexInput} 
          className={styles.input}
        />
      </div>

      <button onClick={() => executeInsertion(InsertOperation.Head)} className={styles.button}>Insert Head</button>
      <button onClick={() => executeInsertion(InsertOperation.Tail)} className={styles.button}>Insert Tail</button>
      <button onClick={() => executeInsertion(InsertOperation.Index)} className={styles.button}>Insert At Index</button>
    </React.Fragment>
  );
};

const LinkedListVisualizer: React.FC = () => {
  const linkedList = React.useRef(new LinkedList<number>());
  const [listData, setListData] = React.useState<number[]>([]);
  // const [listOperationInputValue, setListOperationInputValue] = React.useState<ListOperation>(ListOperation.Insert);

  return (
    <div className={styles.container}>
      {/* Control Panel Section */}
      <div className={styles.controls}>
        <InsertionControls {...{ linkedList, setListData }} />
      </div>

      {/* Visual Canvas Section */}
      <div className={styles.visualContainer}>
        {listData.length === 0 ? (
          <div className={styles.nullWrapper}>
            <div className={styles.pointerLabelNull}>HEAD ➔ NULL</div>
            <div className={styles.pointerLabelNull}>TAIL ➔ NULL</div>
            <div className={styles.nullPointer}>Empty List</div>
          </div>
        ) : (
          listData.map((value: any, index: number) => (
            <Node {...{ 
              index, 
              value, 
              isHead: index === 0, 
              isTail: index === listData.length - 1,
            }} />
          ))
        )}
      </div>
    </div>
  );
};

export default LinkedListVisualizer;