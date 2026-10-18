import React, { useState, useMemo } from 'react';
import "@blueprintjs/core/lib/css/blueprint.css";
import '@blueprintjs/table/lib/css/table.css';
import { Cell, Column, Table } from "@blueprintjs/table";
import { LRUCache } from ".";
import styles from "./visualizer.scss";
import { LinkedListCanvas, LinkedListType } from '../linked-list/visualizer';
import { LinkedListNode } from '../linked-list/LinkedList';
import { Button, FormGroup, InputGroup, NumericInput, setRef } from '@blueprintjs/core/lib/esm';

interface LRUCacheHashMapProps {
  key: number;
  nodes: LinkedListNode<any>[];
  capacity: number;
}

const LRUCacheHashMap: React.FC<LRUCacheHashMapProps> = ({
  capacity,
  key,
  nodes,
}) => {
  const keyRenderer = (rowIndex: number) => rowIndex < nodes?.length ? (<Cell>{nodes[rowIndex]?.key}</Cell>) : undefined;
  const valueRenderer = (rowIndex: number) => rowIndex < nodes?.length ? (<Cell>{nodes[rowIndex]?.value}</Cell>) : undefined;
  const prevRenderer = (rowIndex: number) => rowIndex < nodes?.length ? (<Cell>{nodes[rowIndex]?.prev?.key ?? "NULL"}</Cell>) : undefined;
  const nextRenderer = (rowIndex: number) => rowIndex < nodes?.length ? (<Cell>{nodes[rowIndex]?.next?.key ?? "NULL"}</Cell>) : undefined;

  return (
    <div className={styles.controls} style={{ width: "100%" }}>
      <Table key={key} numRows={capacity} enableGhostCells={true}>
        <Column name="Key" cellRenderer={keyRenderer} />
        <Column name="Value" cellRenderer={valueRenderer} />
        <Column name="Prev" cellRenderer={prevRenderer} />
        <Column name="Next" cellRenderer={nextRenderer} />      
      </Table>
    </div>
  );
};

interface ControlsProps {
  capacityValue: number;
  setCapacityValue: (value: React.SetStateAction<number>) => void;
  keyValue: string;
  valueValue: string;
  setKeyValue: (value: React.SetStateAction<string>) => void;
  setValueValue: (value: React.SetStateAction<string>) => void;
  handleClear: () => void;
  handlePut: (key: string, value: string) => void;
  handleGet: (searchKey: string) => void;
  handleSetCapacity: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  capacityValue, 
  keyValue,
  valueValue,
  setCapacityValue,
  setKeyValue,
  setValueValue,
  handleClear,
  handleGet,
  handlePut,
  handleSetCapacity,
}) => {
  return (
    <div className={styles.controls} style={{ width: "100%" }}>
       <FormGroup label="Capacity">
        <NumericInput 
          value={capacityValue}
          onValueChange={(v) => setCapacityValue(v)}
          min={0}
        />
      </FormGroup>
      <Button intent="primary" onClick={handleSetCapacity} style={{ marginRight: "16px" }}>
        Apply
      </Button>
      <FormGroup label="Key">
        <InputGroup 
          placeholder="e.g. 'a'"
          value={keyValue}
          onValueChange={(v) => setKeyValue(v)}
        />
      </FormGroup>
      <FormGroup label="Value">
        <InputGroup 
          placeholder="e.g. '100', 'Foo bar', etc"
          value={valueValue}
          onValueChange={(v) => setValueValue(v)}
        />
      </FormGroup>
      <Button intent="primary" onClick={() => handlePut(keyValue, valueValue)}>
        {"PUT (Insert/Update)"}
      </Button>
      <Button intent="primary" onClick={() => handleGet(keyValue)}>
        {"GET (Lookup)"}
      </Button>
      <Button intent="primary" onClick={handleClear}>
        Clear Cache
      </Button>
    </div>
  );
};

const LRUCacheVisualizer: React.FC = () => {
  // --- STATE LAYER ---
  const [nodes, setNodes] = useState<LinkedListNode<any>[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [capacityValue, setCapacityValue] = useState<number>(4);
  const [keyValue, setKeyValue] = useState<string>("");
  const [valueValue, setValueValue] = useState<string>("");
  const [logs, setLogs] = useState<string[]>(['Cache initialized with capacity 4.']);
  const lruCache = React.useRef(new LRUCache<string>(capacityValue));

  React.useEffect(() => {
    if (refresh) {
      setNodes([...[], ...lruCache.current.linkedList.getNodes() as LinkedListNode<any>[]]);
    }
  }, [refresh]);

  // --- LOGGING HELPER ---
  const addLog = (msg: string) => {
    // setLogs((prev) => [msg, ...prev.slice(0, 14)]);
    setLogs((prev) => [...prev, msg]);
  };

  // GET Operation
  const handleGet = (searchKey: string) => {
    if (!searchKey.trim()) return;
    
    const getResult = lruCache.current.get(searchKey);

    if (getResult === undefined) { // if (!cacheMap[searchKey]) {
      addLog(`❌ GET [${searchKey}]: Cache Miss!`);
    } else {
      addLog(`✨ GET [${searchKey}]: Cache Hit! Returned ${getResult}. Node moved to HEAD.`);
    }

    setKeyValue("");
    setValueValue("");
    setRefresh(prev => prev + 1);
  };

  // PUT Operation
  const handlePut = (key: string, value: string) => {
    if (!key.trim() || !value.trim()) return;

    const currentKeys = Object.keys(lruCache.current.map);

    // anticipate that the tail will be evicted. the .set() will do
    // the eviction automatically
    const full = currentKeys.length === capacityValue;

    // check if key already exists
    const exists = !!lruCache.current.map[key];
    const currentValue = lruCache.current.map[key]?.value;

    lruCache.current.set(key, value);

    if (exists) {
      addLog(`🔄 PUT [${key}, ${value}]: Key exists (current value = ${currentValue}). Updated value and moved to HEAD.`);
    } else if (full) {
      const nodeToEvict = lruCache.current.linkedList.tail;
      addLog(`⚠️ Evicting Least Recently Used (LRU) TAIL node: [${nodeToEvict?.key}]`);
    } else {
      addLog(`📥 PUT [${key}, ${value}]: Inserted at HEAD.`);
    }

    setKeyValue("");
    setValueValue("");
    setRefresh(prev => prev + 1);
  };

  // Clear / Reset layout
  const handleClear = () => {
    lruCache.current.clear();
    addLog("Cache cleared");
    setRefresh(prev => prev + 1);
  };

  const handleSetCapacity = () => {
    // anticipate if any nodes will be removed from the tail end
    let tails = "";
    if (capacityValue < lruCache.current.capacity) {
      const nodes = lruCache.current.linkedList.getNodes();
      let diff = nodes.length - capacityValue;
      for (let i = nodes.length - 1; i >= 0 && diff > 0; i--, diff--) {
        tails += `${i < nodes.length - 1 ? ", " : ""}${nodes[i]?.key}`;
      }
    }

    lruCache.current.setCapacity(capacityValue);
    addLog(`Capacity updated: ${capacityValue}`);

    if (tails) {
      if (tails.length > 1) {
        addLog(`⚠️ Evicting Least Recently Used (LRU) nodes, starting with TAIL: [${tails}]`);
      } else {
        addLog(`⚠️ Evicting Least Recently Used (LRU) TAIL node: [${tails}]`);
      }
    }

    setRefresh(prev => prev + 1);
  };

  return (
    <div>
      <header className="mb-6 border-b pb-4" style={{ paddingLeft: "20px", paddingTop: "20px" }}>
        <h1 className="text-3xl font-extrabold text-indigo-700">LRU Cache Data Structure Visualizer</h1>
        <p className="text-gray-500 mt-1">Watch real-time interaction between HashMap lookups and Doubly Linked List priority sequencing.</p>
      </header>

      {/* CONTROL CONSOLE */}
      <Controls
        {...{
          capacityValue, 
          keyValue,
          valueValue,
          setCapacityValue,
          setKeyValue,
          setValueValue,
          handleClear,
          handleGet,
          handlePut,
          handleSetCapacity,          
        }}
      />

      {/* HASHMAP LOOKUP REGISTER */}
      <div style={{ marginBottom: "50px" }}>
        <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2" style={{ marginBottom: "8px", paddingLeft: "20px" }}>
          <span>🗄️</span> Hash Map (O(1) Pointers)
        </h2>
        <p className="text-xs text-gray-400 mb-4" style={{ paddingLeft: "20px" }}>
          Maps arbitrary keys directly to their node reference values inside memory. {Object.keys(lruCache.current.map).length === 0 && (<strong>Map is currently empty.</strong>)}
        </p>
        <div>
          <LRUCacheHashMap
            key={refresh}
            capacity={lruCache.current.capacity}
            nodes={nodes as LinkedListNode<any>[]}
          />
        </div>
      </div>

      {/* DOUBLY LINKED LIST CHRONOLOGY */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-2 flex items-center gap-2" style={{ paddingLeft: "20px" }}>
          <span>⛓️</span> Doubly Linked List (Recency Order)
        </h2>
        <div className="flex gap-4 text-xs text-gray-500 mb-6 bg-slate-50 p-2 rounded" style={{ marginBottom: "8px", paddingLeft: "20px" }}>
          <div style={{ marginBottom: "8px" }}>
            <strong className="text-indigo-600">HEAD</strong> <span className="text-gray-400"> (Most Recently Used):</span> {lruCache.current.linkedList.head ? `"${lruCache.current.linkedList.head.key}"` : 'NULL'}{' '}
          </div>
          <div>
            <strong className="text-amber-600">TAIL</strong> <span className="text-gray-400"> (Least Recently Used):</span> {lruCache.current.linkedList.tail ? `"${lruCache.current.linkedList.tail.key}"` : 'NULL'}{' '}
          </div>
        </div>

        {/* NODES VISUAL GRAPHICS CONTAINER */}
        <LinkedListCanvas
          listNodes={nodes} 
          selectedListType={LinkedListType.Double}
          showKeys={true}
          showValues={true}
        />
      </div>

      {/* REAL TIME CONSOLE EVENT LOGGER */}
      <div className="mt-8 border-t pt-4">
        <h3 className="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wide" style={{ paddingLeft: "20px" }}>Operation Lifecycle Logs</h3>
        <div 
          style={{ 
            width: "100%",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            marginBottom: "50px",
          }}
        >
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              {">  "}{log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LRUCacheVisualizer;

