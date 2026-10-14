import React from "react";
import { ILinkedList } from ".";
import styles from "./visualizer.scss";
import ButtonWithMenu from "@src/components/ButtonWithMenu";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Button, FormGroup, InputGroup, MenuItem, NumericInput, Tooltip } from "@blueprintjs/core/lib/esm";
import { Select } from "@blueprintjs/select/lib/esm";
import DoublyLinkedList from "./DoublyLinkedList";
import { LinkedList, LinkedListNode } from "./LinkedList";

enum InsertDeleteOperation {
  Head = "head",
  Tail = "tail",
  Index = "index",
}

enum LinkedListType {
  Standard = "standard",
  Double = "double"
}

interface NodeProps {
  index: number;
  node: LinkedListNode<number> | null;
  isHead: boolean;
  isTail: boolean;
  type: LinkedListType;
}

interface ListControlsProps {
  linkedList: React.MutableRefObject<ILinkedList<number>>;
  selectedListType: LinkedListType;
  setSelectedListType: React.Dispatch<React.SetStateAction<LinkedListType>>;
  setListData: React.Dispatch<React.SetStateAction<Array<LinkedListNode<number> | null>>>;
}

const Node: React.FC<NodeProps> = ({ index, node, isHead, isTail, type }: NodeProps) => {

  return (
    <React.Fragment key={index}>
      {/* Node Container containing labels + structural node box */}
      <div className={styles.nodeWrapper}>
        {/* Floating Pointer Head Indicator */}
        {isHead && <div className={styles.headPointerTag}>HEAD ⬇</div>}
        
        <div className={styles.node}>
          { type === LinkedListType.Double && (
            <Tooltip 
              content={isHead ? 'prev: NULL' : `prev: ${node?.prev?.value}`}
              placement="bottom-start"
            >
              <div className={styles.nodePrev}>
                {isHead ? 'NULL' : '•'}
              </div>
            </Tooltip>        
          )}
          <div className={styles.nodeData}>{node?.value}</div>
            <Tooltip 
              content={isTail ? 'next: NULL' : `next: ${node?.next?.value}`}
              placement="bottom-start"
            >
              <div className={styles.nodeNext}>
                {isTail ? 'NULL' : '•'}
              </div>
            </Tooltip>
        </div>

        {/* Floating Pointer Tail Indicator */}
        {isTail && <div className={styles.tailPointerTag}>⬆ TAIL</div>}
      </div>
      
      {/* Connected structural arrow */}
      {!isTail && (
        <div className={styles.arrow}>{type === LinkedListType.Standard ? "➔" : "⇄"}</div>
      )}
    </React.Fragment>  
  );
};

const ListControls: React.FC<ListControlsProps> = (
  {
    linkedList,
    selectedListType,
    setSelectedListType,
    setListData,
  }: ListControlsProps,
) => {
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
    <React.Fragment>
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
    </React.Fragment>
  );
};

const LinkedListVisualizer: React.FC = () => {
  const [selectedListType, setSelectedListType] = React.useState<LinkedListType>(LinkedListType.Standard);
  const linkedList = React.useRef(new LinkedList<number>());
  const [listData, setListData] = React.useState<Array<LinkedListNode<number> | null>>([]);

  React.useEffect(() => {
    linkedList.current = selectedListType === LinkedListType.Standard
      ? new LinkedList<number>()
      : new DoublyLinkedList<number>();
    setListData([]);
  }, [selectedListType]);

  return (
    <div className={styles.container}>
      <div className={styles.controls} style={{ width: "100%" }}>
        <ListControls {...{ linkedList, selectedListType, setSelectedListType, setListData }} />
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
          listData.map((node: LinkedListNode<number> | null, index: number) => (
            <Node {...{ 
              index, 
              node, 
              isHead: index === 0, 
              isTail: index === listData.length - 1,
              key: index,
              type: selectedListType,
            }} />
          ))
        )}
      </div>
    </div>
  );
};

export default LinkedListVisualizer;