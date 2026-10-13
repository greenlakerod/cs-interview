import React from "react";
import { LinkedList } from ".";
import styles from "./visualizer.scss";
import ButtonWithMenu from "@src/components/ButtonWithMenu";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Button, FormGroup, InputGroup, NumericInput } from "@blueprintjs/core/lib/esm";

enum InsertDeleteOperation {
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

  const executeInsertion = (insertionType: InsertDeleteOperation) => {
    const numericValue = Number(insertValue);
    if (isNaN(numericValue)) {
      alert("Please enter a valid numeric value");
      return;
    }

    try {
      switch (insertionType) {
        case InsertDeleteOperation.Head:
          linkedList.current.addFirst(numericValue);
          break;
        case InsertDeleteOperation.Tail:
          linkedList.current.addLast(numericValue);
          break;
        case InsertDeleteOperation.Index:
          linkedList.current.add(numericValue, insertIndex);
        default:
          break;
      }

      if (linkedList.current) {
        setListData(linkedList.current.values);
      }
    } catch (err) {
      console.error("Failure: ", err);
    }
  };

  const executeDeletion = (deletionType: InsertDeleteOperation) => {
    try {
      switch (deletionType) {
        case InsertDeleteOperation.Head:
          linkedList.current.removeFirst();
          break;
        case InsertDeleteOperation.Tail:
          linkedList.current.removeLast();
          break;
        case InsertDeleteOperation.Index:
        default:
          linkedList.current.remove(insertIndex);
          break;
      }

      if (linkedList.current) {
        setListData(linkedList.current.values);
      }
    } catch (err) {
      console.error("Failure: ", err);
    }
  };

  const executeReverse = () => {
    try {
      linkedList.current.reverse();
      if (linkedList.current) {
        setListData(linkedList.current.values);
      }
    }
    catch (err) { console.error("Failure: ", err); }    
  };

  const executeClear = () => {
    try {
      linkedList.current.clear();
      if (linkedList.current) {
        setListData(linkedList.current.values);
      }
    }
    catch (err) { console.error("Failure: ", err); }    
  };

  return (
    <React.Fragment>
      <FormGroup label="Value">
        <NumericInput 
          value={insertValue}
          onValueChange={(v) => setInsertValue(v)}
        />
      </FormGroup>
      <FormGroup label="Index">
        <NumericInput 
          value={insertIndex}
          onValueChange={(v) => setInsertIndex(v)}
          min={0}
        />
      </FormGroup>
      <ButtonWithMenu
        text="Insert at"
        menuItems={[
          { text: "Head", onClick: () => executeInsertion(InsertDeleteOperation.Head) },
          { text: "Tail", onClick: () => executeInsertion(InsertDeleteOperation.Tail) },
          { text: "Index", onClick: () => executeInsertion(InsertDeleteOperation.Index) },
        ]}
      />
      <ButtonWithMenu
        text="Delete at"
        menuItems={[
          { text: "Head", onClick: () => executeDeletion(InsertDeleteOperation.Head) },
          { text: "Tail", onClick: () => executeDeletion(InsertDeleteOperation.Tail) },
          { text: "Index", onClick: () => executeDeletion(InsertDeleteOperation.Index) },
        ]}
      />
      <Button intent="primary" onClick={executeReverse}>
        Reverse
      </Button>
      <Button intent="primary" onClick={executeClear}>
        Clear
      </Button>
    </React.Fragment>
  );
};

const LinkedListVisualizer: React.FC = () => {
  const linkedList = React.useRef(new LinkedList<number>());
  const [listData, setListData] = React.useState<number[]>([]);

  return (
    <div className={styles.container}>
      <div className={styles.controls} style={{ width: "100%" }}>
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