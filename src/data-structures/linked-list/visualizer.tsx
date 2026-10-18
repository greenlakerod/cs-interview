import React from "react";
import { ILinkedList } from ".";
import styles from "./visualizer.scss";
import ButtonWithMenu from "@src/components/ButtonWithMenu";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Button, FormGroup, InputGroup, MenuItem, NumericInput, Tooltip } from "@blueprintjs/core/lib/esm";
import { Select } from "@blueprintjs/select/lib/esm";
import DoublyLinkedList from "./DoublyLinkedList";
import * as ds from "./LinkedList";


enum InsertDeleteOperation {
  Head = "head",
  Tail = "tail",
  Index = "index",
}

export enum LinkedListType {
  Standard = "standard",
  Double = "double"
}

export interface LinkedNodeProps<T> {
  headPtrLabel?: string;
  index: number;
  isHead: boolean;
  isTail: boolean;
  node: ds.LinkedListNode<T> | null;
  type: LinkedListType;
  showKey?: boolean;
  showValue?: boolean;
  tailPtrLabel?: string;
}

interface LinkedListControlsProps {
  linkedList: React.MutableRefObject<ILinkedList<number>>;
  selectedListType: LinkedListType;
  setSelectedListType: React.Dispatch<React.SetStateAction<LinkedListType>>;
  setListData: React.Dispatch<React.SetStateAction<Array<ds.LinkedListNode<number> | null>>>;
}

export interface LinkedListCanvasProps<T> {
  headPtrLabel?: string;
  listNodes: Array<ds.LinkedListNode<T> | null>;
  selectedListType: LinkedListType;
  showKeys?: boolean;
  showValues?: boolean;
  tailPtrLabel?: string;
}

export function LinkedListNode<T>({
  headPtrLabel = "HEAD",
  index, 
  isHead, 
  isTail, 
  node,
  showKey,
  showValue = true,
  type,
  tailPtrLabel = "TAIL",
}: LinkedNodeProps<T>) {
  const renderLabel = () => {
    let label = "";
    if (showValue) label = `${node?.value}`;
    if (showKey) {
      if (label) label = `${node?.key ?? "NO KEY"} (${label})`;
      else label = `${node?.key}`;
    }
    if (!label) label = "NO DATA";

    let content = (
      <div className={styles.nodeData}>{label}</div>
    );

    if (showKey && showValue) {
      content = (
        <Tooltip
          content={`Key: ${node?.key}, Value: ${node?.value}`}
          placement="bottom-start"
        >
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  const renderPtrLabel = (n?: ds.LinkedListNode<T> | null) => {
    let label = "";
    if (showValue) label = `${n?.value}`;
    if (showKey) {
      if (label) label = `[Key: ${n?.key ?? "NO KEY"}, Value: ${label}]`;
      else label = `${n?.key}`;
    }
    if (!label) label = "NO DATA";
    return label;
  };

  return (
    <React.Fragment key={index}>
      {/* Node Container containing labels + structural node box */}
      <div className={styles.nodeWrapper}>
        {/* Floating Pointer Head Indicator */}
        {isHead && <div className={styles.headPointerTag}>{`${headPtrLabel} ⬇`}</div>}
        <div className={styles.node}>
          { type === LinkedListType.Double && (
            <Tooltip 
              content={isHead ? 'prev: NULL' : `prev: ${renderPtrLabel(node?.prev)}`}
              placement="bottom-start"
            >
              <div className={styles.nodePrev}>
                {isHead ? 'NULL' : '•'}
              </div>
            </Tooltip>        
          )}
          {renderLabel()}
          <Tooltip 
            content={isTail ? 'next: NULL' : `next: ${renderPtrLabel(node?.next)}`}
            placement="bottom-start"
          >
            <div className={styles.nodeNext}>
              {isTail ? 'NULL' : '•'}
            </div>
          </Tooltip>
        </div>

        {/* Floating Pointer Tail Indicator */}
        {isTail && <div className={styles.tailPointerTag}>{`⬆ ${tailPtrLabel}`}</div>}
      </div>
      
      {/* Connected structural arrow */}
      {!isTail && (
        <div className={styles.arrow}>{type === LinkedListType.Standard ? "➔" : "⇄"}</div>
      )}
    </React.Fragment>  
  );
}

const LinkedListControls: React.FC<LinkedListControlsProps> = ({
  linkedList,
  selectedListType,
  setSelectedListType,
  setListData,
}: LinkedListControlsProps) => {
  const [insertValue, setInsertValue] = React.useState(1);
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
        // setListData(linkedList.current.values ?? []);
        setListData(linkedList.current.getNodes());
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
        // setListData(linkedList.current.values ?? []);
        setListData(linkedList.current.getNodes());
      }
    } catch (err) {
      console.error("Failure: ", err);
    }
  };

  const executeReverse = () => {
    try {
      linkedList.current.reverse();
      if (linkedList.current) {
        // setListData(linkedList.current.values ?? []);
        setListData(linkedList.current.getNodes());
      }
    }
    catch (err) { console.error("Failure: ", err); }    
  };

  const executeClear = () => {
    try {
      linkedList.current.clear();
      if (linkedList.current) {
        // setListData(linkedList.current.values ?? []);
        setListData(linkedList.current.getNodes());
      }
    }
    catch (err) { console.error("Failure: ", err); }    
  };

  const listTypes = Object.entries(LinkedListType).map(([key, linkedListType]) => ({ label: key, value: linkedListType }));
  
  return (
    <div className={styles.controls} style={{ width: "100%" }}>
      <FormGroup label="Linked List">
        <Select 
          activeItem={listTypes.find(i => i.value === selectedListType)}
          items={listTypes} 
          itemRenderer={(listType, { handleClick, handleFocus, modifiers, query }) => {
            if (!modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                  active={modifiers.active}
                  disabled={modifiers.disabled}
                  key={listType.value}
                  label={listType.value.toString()}
                  onClick={handleClick}
                  onFocus={handleFocus}
                  roleStructure="listoption"
                  text={listType.label}
                />
            );
          }} 
          onItemSelect={({ value }) => setSelectedListType(value)} 
        >
          <Button text={listTypes.find(i => i.value === selectedListType)?.label ?? "Select a linked list type"} endIcon="caret-down" />
        </Select>
      </FormGroup>
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
    </div>
  );
};

export function LinkedListCanvas<T>({ 
  listNodes = [], 
  selectedListType,
  showKeys,
  showValues,
}: LinkedListCanvasProps<T>) {
  return (
    <div className={styles.visualContainer}>
      {listNodes.length === 0 ? (
        <div className={styles.nullWrapper}>
          <div className={styles.pointerLabelNull}>HEAD ➔ NULL</div>
          <div className={styles.pointerLabelNull}>TAIL ➔ NULL</div>
          <div className={styles.nullPointer}>Empty List</div>
        </div>
      ) : (
        listNodes.map((node: ds.LinkedListNode<T> | null, index: number) => (
          <LinkedListNode {...{ 
            index, 
            node, 
            isHead: index === 0, 
            isTail: index === listNodes.length - 1,
            key: index,
            showKey: showKeys,
            showValue: showValues,
            type: selectedListType,
          }} />
        ))
      )}
    </div>
  );
}

const LinkedListVisualizer: React.FC = () => {
  const [selectedListType, setSelectedListType] = React.useState<LinkedListType>(LinkedListType.Standard);
  const linkedList = React.useRef(new ds.LinkedList<number>());
  const [listData, setListData] = React.useState<Array<ds.LinkedListNode<number> | null>>([]);

  React.useEffect(() => {
    linkedList.current = selectedListType === LinkedListType.Standard
      ? new ds.LinkedList<number>()
      : new DoublyLinkedList<number>();
    setListData([]);
  }, [selectedListType]);

  return (
    <div className={styles.container}>
      <LinkedListControls {...{ linkedList, selectedListType, setSelectedListType, setListData }} />
      <LinkedListCanvas {...{ selectedListType, listNodes: listData, showValues: true }} />
    </div>
  );
};

export default LinkedListVisualizer;