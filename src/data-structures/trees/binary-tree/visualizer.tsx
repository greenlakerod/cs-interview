import React, { FormEvent } from "react";
import * as ds from ".";
import * as bst from "./binary-search-tree";
import styles from "./visualizer.scss";
import { Button, FormGroup, InputGroup, MenuItem, NumericInput } from "@blueprintjs/core/lib/esm";
import { TreeTraversal } from "./serializer";
import { Select } from "@blueprintjs/select/lib/esm";

enum BinaryTreeType {
  BinarySearchTree = "binarySearchTree",
}

interface BinaryTreeNodeRenderProps {
  value: number;
  x: number;
  y: number;
  parentX: number | null;
  parentY: number | null;  
}

interface BinaryTreeCanvasProps {
  renderedNodes?: BinaryTreeNodeRenderProps[];
}

const BinaryTreeNodeLine: React.FC<BinaryTreeNodeRenderProps> = (node) => {
  const x1 = node.parentX !== null ? node.parentX : undefined;
  const y1 = node.parentY !== null ? node.parentY : undefined;

  return (
    <line
      key={`edge-${node.value}`}
      x1={x1}
      y1={y1}
      x2={node.x}
      y2={node.y}
      stroke="#9ca3af"
      strokeWidth="2"
    />
  );
};

const BinaryTreeNode: React.FC<BinaryTreeNodeRenderProps> = (node) => {
  return (
    <g key={`node-${node.value}`}>
      <circle
        cx={node.x}
        cy={node.y}
        r="20"
        fill="#3b82f6"
        stroke="#1d4ed8"
        strokeWidth="2"
      />
      <text
        x={node.x}
        y={node.y}
        dy="5"
        textAnchor="middle"
        fill="#ffffff"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {node.value}
      </text>
    </g>
  );
};

const BinaryTreeCanvas: React.FC<BinaryTreeCanvasProps> = ({ renderedNodes = [] }) => {
  return (
    <svg width="800" height="400" viewBox="0 0 800 400" style={{ display: 'block', margin: '0 auto' }}>
      {/* Render Connective Edges First */}
      {renderedNodes.map((node, index) => {
        if (node.parentX === null || node.parentY === null) return null;
        return <BinaryTreeNodeLine key={`node-${node.value}-line-${index}`} {...node} />;
      })}
      {/* Render Nodes On Top */}
      {renderedNodes.map((node) => <BinaryTreeNode key={`node-${node.value}`} {...node} />)}
    </svg>
  );
};

interface ControlsProps {
  handleClear: (e: React.FormEvent<Element>) => void;
  handleDelete: (e: React.FormEvent<Element>) => void;
  handleDeserialize: (e: React.FormEvent<Element>) => void;
  handleInsert: (e: React.FormEvent<Element>) => void;
  handleSerialize: (e: React.FormEvent<Element>) => void;
  inputValue?: number | string;
  serializedData: string;
  setInputValue: React.Dispatch<React.SetStateAction<number | string | undefined>>;
  setSerializedData: React.Dispatch<React.SetStateAction<string>>;
  setTraversalOrder: React.Dispatch<React.SetStateAction<TreeTraversal>>;
  traversalOrder: TreeTraversal;
}

const Controls: React.FC<ControlsProps> = ({
  handleClear,
  handleDelete,
  handleDeserialize,
  handleInsert,
  handleSerialize,
  inputValue,
  serializedData,
  setInputValue,
  setSerializedData,
  setTraversalOrder,
  traversalOrder,
}) => {
  const orderTypes = Object.entries(TreeTraversal).map(([key, type]) => ({ label: key, value: type }));
  
  return (
    <div className={styles.controls} style={{ width: "100%" }}>
      <FormGroup label="Enter a number">
        <NumericInput 
          value={inputValue}
          onValueChange={(v) => setInputValue(v)}
        />
      </FormGroup>
      <Button intent="primary" onClick={handleInsert}>
        Insert
      </Button>
      <Button intent="primary" onClick={handleDelete}>
        Delete
      </Button>
      <Button intent="primary" onClick={handleClear}>
        Clear
      </Button>
      <FormGroup label="Enter node data">
        <InputGroup 
          placeholder="e.g. 'a,b,c,#'"
          value={serializedData}
          onValueChange={(v) => setSerializedData(v)}
        />
      </FormGroup>
      <FormGroup label="Traversal Order">
        <Select 
          activeItem={orderTypes.find(i => i.value === traversalOrder)}
          items={orderTypes} 
          itemRenderer={(orderType, { handleClick, handleFocus, modifiers, query }) => {
            if (!modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                  active={modifiers.active}
                  disabled={modifiers.disabled}
                  key={orderType.value}
                  label={orderType.value.toString()}
                  onClick={handleClick}
                  onFocus={handleFocus}
                  roleStructure="listoption"
                  text={orderType.label}
                />
            );
          }} 
          onItemSelect={({ value }) => setTraversalOrder(value)} 
        >
          <Button text={orderTypes.find(i => i.value === traversalOrder)?.label ?? "Select a linked list type"} endIcon="caret-down" />
        </Select>
      </FormGroup>
      <Button intent="primary" onClick={handleSerialize}>
        Serialize
      </Button>
      <Button intent="primary" onClick={handleDeserialize}>
        Deserialize
      </Button>
    </div>
  );
};

const BinaryTreeVisualizer: React.FC = () => {
  const [treeType /* , setTreeType */] = React.useState<BinaryTreeType>(BinaryTreeType.BinarySearchTree);
  const tree = React.useRef<ds.IBinaryTree<number>>(new bst.BinarySearchTree<number>());

  const [inputValue, setInputValue] = React.useState<string | number>(); // React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");

  const [traversalOrder, setTraversalOrder] = React.useState<TreeTraversal>(TreeTraversal.PreOrder);
  const [serializedData, setSerializedData] = React.useState<string>("");

  React.useEffect(() => {
    // only one tree type so far
    tree.current = new bst.BinarySearchTree<number>();
  }, [treeType]);

  const handleInsert = (e: FormEvent) => {
    e.preventDefault();

    if (inputValue === null || inputValue === undefined) return;

    let val = inputValue;
    if (typeof val === "string") {
      val = parseInt(val, 10);
    }
    if (isNaN(val)) return;

    if (
      treeType === BinaryTreeType.BinarySearchTree && 
      tree.current.find(val)
    ) {
      setMessage(`Value ${val} already exists in the tree.`);
      return;
    }

    tree.current.add(val);
    setMessage(`Inserted ${val} into the tree.`);
    setInputValue("");
  };

  const handleDelete = (e: FormEvent) => {
    e.preventDefault();

    if (inputValue === null || inputValue === undefined) return;

    let val = inputValue;
    if (typeof val === "string") {
      val = parseInt(val, 10);
    }
    if (isNaN(val)) return;

    tree.current.remove(val);
    setMessage(`Attempted to delete ${val} from the tree.`);
    setInputValue("");
  };

  const handleClear = (e: FormEvent) => {
    e.preventDefault();

    tree.current.clear();
    setMessage("Tree cleared.");
    setInputValue("");
  };

  const handleSerialize = (e: FormEvent) => {
    e.preventDefault();

    const serialized = tree.current.serialize(traversalOrder);
    setMessage(serialized);
    setInputValue("");
  };

  const handleDeserialize = (e: FormEvent) => {
    // preorder data: 20,12,9,5,#,#,10,#,#,17,14,#,15,#,#,19,#,#,29,25,#,27,#,#,45,#,60,#
    // postorder data: #,#,5,#,#,10,9,#,#,#,15,14,#,#,19,17,12,#,#,#,27,25,#,#,#,60,45,29,20
    // levelorder data: 20,12,29,9,17,25,45,5,10,14,19,#,27,#,60,#,#,#,#,#,15,#,#,#,#,#,#,#,#
    // inorder data: 16:#,8:5,17:#,17:#,4:9,9:#,18:#,9:10,19:#,19:#,2:12,5:#,20:#,10:14,21:#,42:#,21:15,43:#,43:#,5:17,11:#,22:#,11:19,23:#,23:#,1:20,3:#,12:#,6:25,13:#,26:#,13:27,27:#,27:#,3:29,7:#,14:#,7:45,15:#,30:#,15:60,31:#

    e.preventDefault();

    tree.current.deserialize(traversalOrder, serializedData, false);
    setMessage("Tree generated from data");
    // setSerializedData("");
  };

  const generateLayout = (
    node: ds.BinaryTreeNode<number> | null,
    x: number,
    y: number,
    hSpacing: number,
    level: number,
    parentX: number | null = null,
    parentY: number | null = null,
    nodesList: BinaryTreeNodeRenderProps[] = []
  ): BinaryTreeNodeRenderProps[] => {
    if (!node) return nodesList;

    nodesList.push({ value: node.value, x, y, parentX, parentY });

    // Dynamically shrink spacing as depth increases to prevent child overlapping
    const nextHSpacing = hSpacing * 0.55;
    const nextY = y + 70;

    if (node.left) {
      generateLayout(node.left, x - hSpacing, nextY, nextHSpacing, level + 1, x, y, nodesList);
    }
    if (node.right) {
      generateLayout(node.right, x + hSpacing, nextY, nextHSpacing, level + 1, x, y, nodesList);
    }

    return nodesList;
  };

  const renderedNodes: BinaryTreeNodeRenderProps[] = React.useMemo(() => {
    return generateLayout(
      tree.current.root as ds.BinaryTreeNode<number>,
      400, 
      50, 
      160, 
      1,
    );
  }, [tree.current.count, tree.current.root]);

  return (
    <div>
      <header className="mb-6 border-b pb-4" style={{ paddingLeft: "20px", paddingTop: "20px" }}>
        <h1 className="text-3xl font-extrabold text-indigo-700">Binary Tree Visualizer</h1>
      </header>
      {/* Controls Form */}
      <Controls
        {...{
          handleClear,
          handleDelete,
          handleDeserialize,
          handleInsert,
          handleSerialize,
          inputValue, 
          serializedData,
          setInputValue,
          setSerializedData,
          setTraversalOrder,
          traversalOrder, 
        }}
      />
      {/* Dynamic Status Messaging */}
      <div style={{ padding: '8px 12px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', color: '#4b5563', overflowX: "auto" }}>
        <strong>Status:</strong> {message}
      </div>
      {/* SVG Canvas for Tree Rendering */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa', overflow: 'auto' }}>
        <BinaryTreeCanvas renderedNodes={renderedNodes} />
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;