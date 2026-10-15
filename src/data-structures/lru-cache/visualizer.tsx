import React, { useState, useMemo } from 'react';
import { LRUCache } from ".";
import { LinkedListCanvas, LinkedListType } from '../linked-list/visualizer';
// import { LinkedListNode } from "../linked-list/LinkedList";

// --- TYPE DEFINITIONS ---
// interface LinkedListNode {
//   key: string;
//   value: string;
//   prev: string | null;
//   next: string | null;
// }

// interface HashMap {
//   [key: string]: LinkedListNode<number>;
// }

// interface FooProps {
//   orderedNodes: LinkedListNode<number>[],
//   head: string | null,
//   tail: string | null,
// }

// const ListCanvas: React.FC<FooProps> = (props: { 
//   orderedNodes: LinkedListNode<number>[],
//   head: string | null,
//   tail: string | null,
// }) => {
//   const { head, orderedNodes, tail } = props;

//   return (
//     <div className="flex flex-wrap items-center gap-y-8 gap-x-2 py-4 px-2 min-h-[140px] overflow-x-auto">
//       {orderedNodes.length === 0 && (
//         <div className="text-sm italic text-gray-400 w-full text-center border border-dashed p-6 rounded">
//           No linked items found. Execute a PUT command.
//         </div>
//       )}
      
//       {orderedNodes.map((node, index) => {
//         const isHead = node.key === head;
//         const isTail = node.key === tail;

//         return (
//           <React.Fragment key={node.key}>
//             {/* Node block item */}
//             <div className={`relative flex flex-col w-32 border-2 rounded-lg bg-white shadow-sm transition-all duration-300 ${
//               isHead ? 'border-indigo-500 ring-2 ring-indigo-100' : isTail ? 'border-amber-500' : 'border-gray-300'
//             }`}>
//               {/* Top label flag indicators */}
//               <div className="absolute -top-5 left-0 right-0 flex justify-between px-1 text-[10px] font-bold">
//                 {isHead && <span className="text-indigo-600 bg-indigo-50 px-1 rounded">HEAD (MRU)</span>}
//                 {isTail && <span className="text-amber-600 bg-amber-50 px-1 rounded ml-auto">TAIL (LRU)</span>}
//               </div>

//               {/* Key Header */}
//               <div className={`text-center py-1 font-bold text-sm text-white rounded-t-sm ${
//                 isHead ? 'bg-indigo-500' : isTail ? 'bg-amber-500' : 'bg-gray-400'
//               }`}>
//                 Key: {node.key}
//               </div>

//               {/* Value Body */}
//               <div className="p-2 text-center text-xs font-mono text-gray-700 bg-gray-50">
//                 Val: <span className="font-bold">{node.value}</span>
//               </div>

//               {/* Inter-pointer footer text values */}
//               <div className="grid grid-cols-2 text-[9px] border-t font-mono text-gray-400 bg-white rounded-b-lg divide-x">
//                 <div className="px-1 py-0.5 truncate text-center" title={`Prev: ${node.prev}`}>
//                   ← {node.prev || '•'}
//                 </div>
//                 <div className="px-1 py-0.5 truncate text-center" title={`Next: ${node.next}`}>
//                   {node.next || '•'} →
//                 </div>
//               </div>
//             </div>

//             {/* Doubly directional arrow connector if not last element */}
//             {index < orderedNodes.length - 1 && (
//               <div className="flex flex-col items-center justify-center text-indigo-400 font-bold text-lg px-1" style={{minWidth: '24px'}}>
//                 <span className="leading-none select-none">⇄</span>
//               </div>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </div>
//   );
// };

const LRUCacheVisualizer: React.FC = () => {
  // --- STATE LAYER ---
  const [capacity, setCapacity] = useState<number>(4);
  const [keyInput, setKeyInput] = useState<string>('');
  const [valInput, setValInput] = useState<string>('');
  
  // Real underlying state matching LRU layout
  // const [cacheMap, setCacheMap] = useState<HashMap>({});
  // const [head, setHead] = useState<string | null>(null);
  // const [tail, setTail] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['Cache initialized with capacity 4.']);

  const lruCache = React.useRef(new LRUCache<number>(capacity));

  React.useEffect(() => {
    lruCache.current.setCapacity(capacity);
  }, [capacity]);

  const { head, tail } = React.useMemo(() => {
    const head = lruCache.current.linkedList.head?.key;
    const tail = lruCache.current.linkedList.tail?.key;
    return { head, tail };
  }, [lruCache.current.linkedList]);

  // --- LOGGING HELPER ---
  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 14)]);
  };

  // --- DERIVED SORTED LIST (FOR THE DOUBLY LINKED LIST VIEW) ---
  // const orderedNodes = useMemo(() => {
  //   const list: LinkedListNode<number>[] = [];
  //   let currentKey = head;
  //   const visited = new Set<string>(); // Prevent infinite loops

  //   while (currentKey && cacheMap[currentKey] && !visited.has(currentKey)) {
  //     visited.add(currentKey);
  //     list.push(cacheMap[currentKey]);
  //     currentKey = cacheMap[currentKey].next;
  //   }
  //   return list;
  // }, [head, cacheMap]);

  // --- CORE LRU CACHE LOGIC OPERATIONS ---
  
  // GET Operation
  const handleGet = (searchKey: string) => {
    if (!searchKey.trim()) return;
    
    const getResult = lruCache.current.get(searchKey);

    if (getResult === undefined) { // if (!cacheMap[searchKey]) {
      addLog(`❌ GET [${searchKey}]: Cache Miss!`);
      return;
    }

    // const targetNode = { ...cacheMap[searchKey] };
    addLog(`✨ GET [${searchKey}]: Cache Hit! Moving node to Head.`);

    // // If it's already head, nothing changes
    // if (head === searchKey) return;

    // const newMap = { ...cacheMap };

    // // Sever ties from current position
    // if (targetNode.prev && newMap[targetNode.prev]) {
    //   newMap[targetNode.prev] = { ...newMap[targetNode.prev], next: targetNode.next };
    // }
    // if (targetNode.next && newMap[targetNode.next]) {
    //   newMap[targetNode.next] = { ...newMap[targetNode.next], prev: targetNode.prev };
    // }

    // // If it was tail, update tail pointer to its previous node
    // if (tail === searchKey) {
    //   setTail(targetNode.prev);
    // }

    // // Re-insert at HEAD
    // if (head && newMap[head]) {
    //   newMap[head] = { ...newMap[head], prev: searchKey };
    // }
    // targetNode.prev = null;
    // targetNode.next = head;
    
    // newMap[searchKey] = targetNode;
    
    // setCacheMap(newMap);
    // setHead(searchKey);
  };

  // PUT Operation
  const handlePut = (k: string, v: string) => {
    if (!k.trim() || !v.trim()) return;

    // const newMap = { ...cacheMap };
    const currentKeys = Object.keys(lruCache.current.map); // Object.keys(newMap);

    // anticipate that the tail will be evicted. the .set() will do
    // the eviction automatically
    if (currentKeys.length === capacity) {
      const nodeToEvict = lruCache.current.linkedList.tail;
      addLog(`⚠️ Evicting Least Recently Used (LRU) Tail Node: [${nodeToEvict?.key}]`);
    }

    // Scenario A: Key already exists (Update value and bring to Head)
    if (lruCache.current.map[k]) { // if (newMap[k]) {
      lruCache.current.set(k, parseInt(v));
      addLog(`🔄 PUT [${k}, ${v}]: Key exists. Updated value and moved to Head.`);
      // newMap[k] = { ...newMap[k], value: v };
      // setCacheMap(newMap);
      // handleGet(k);
      return;
    }

    // Scenario B: Cache Capacity Exceeded (Evict Tail Node)
    // if (currentKeys.length >= capacity) { // if (currentKeys.length >= capacity && tail) {
    //   const nodeToEvict = newMap[tail];
    //   addLog(`⚠️ Evicting Least Recently Used (LRU) Tail Node: [${tail}]`);
      
    //   delete newMap[tail];
      
    //   if (nodeToEvict.prev && newMap[nodeToEvict.prev]) {
    //     newMap[nodeToEvict.prev] = { ...newMap[nodeToEvict.prev], next: null };
    //     setTail(nodeToEvict.prev);
    //   } else {
    //     // Only 1 item existed
    //     setHead(null);
    //     setTail(null);
    //   }
    // }

    // // Create New Node
    // const newNode: LinkedListNode = {
    //   key: k,
    //   value: v,
    //   prev: null,
    //   next: head,
    // };

    // // Link old head back to new node
    // if (head && newMap[head]) {
    //   newMap[head] = { ...newMap[head], prev: k };
    // }

    // newMap[k] = newNode;

    // // If cache was totally empty, this new node is also the tail
    // if (!head || currentKeys.length === 0 || (currentKeys.length >= capacity && !newMap[tail || ''])) {
    //   // Find actual remaining tail if evicted or default to current
    //   const remainingKeys = Object.keys(newMap);
    //   if (remainingKeys.length === 1) {
    //     setTail(k);
    //   }
    // }

    // setHead(k);
    // setCacheMap(newMap);
    lruCache.current.set(k, parseInt(v));
    addLog(`📥 PUT [${k}, ${v}]: Inserted at Head.`);
    setKeyInput('');
    setValInput('');
  };

  // Clear / Reset layout
  const handleClear = () => {
    // setCacheMap({});
    // setHead(null);
    // setTail(null);
    lruCache.current.clear();
    setLogs([`Cache cleared. New capacity: ${capacity}`]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen text-gray-800 font-sans">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-indigo-700">LRU Cache Data Structure Visualizer</h1>
        <p className="text-gray-500 mt-1">Watch real-time interaction between HashMap lookups and Doubly Linked List priority sequencing.</p>
      </header>

      {/* CONTROL CONSOLE */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border">
        {/* Configuration */}
        <div className="flex flex-col gap-2 p-2 border-r border-gray-100">
          <label className="text-xs uppercase font-bold text-gray-500">Cache Capacity</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={capacity} 
              onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button onClick={handleClear} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 transition text-sm">
              Apply & Reset
            </button>
          </div>
        </div>

        {/* Action input formulas */}
        <div className="md:col-span-2 flex flex-wrap gap-4 items-end p-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold text-gray-500">Key</label>
            <input 
              type="text" 
              placeholder="e.g., 'a'" 
              value={keyInput} 
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-28 px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold text-gray-500">Value</label>
            <input 
              type="text" 
              placeholder="e.g., '100'" 
              value={valInput} 
              onChange={(e) => setValInput(e.target.value)}
              className="w-32 px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handlePut(keyInput, valInput)}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition text-sm shadow-sm"
            >
              PUT (Insert/Update)
            </button>
            <button 
              onClick={() => handleGet(keyInput)}
              className="px-4 py-1.5 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition text-sm shadow-sm"
            >
              GET (Lookup)
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COMPONENT 1: HASHMAP LOOKUP REGISTER */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span>🗄️</span> Hash Map (O(1) Pointers)
          </h2>
          <p className="text-xs text-gray-400 mb-4">Maps arbitrary keys directly to their node reference values inside memory.</p>
          
          {Object.keys(lruCache.current.map).length === 0 ? ( // {Object.keys(cacheMap).length === 0 ? (
            <div className="text-sm italic text-gray-400 p-4 border border-dashed rounded text-center">Map is currently empty</div>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              <div className="grid grid-cols-3 font-bold bg-gray-100 p-2 rounded text-gray-600">
                <div>Hash Key</div>
                <div className="col-span-2">Pointer Ref (Prev / Next)</div>
              </div>
              {Object.entries(lruCache.current.map).map(([k, node]) => ( // {Object.entries(cacheMap).map(([k, node]) => (
                <div key={k} className="grid grid-cols-3 items-center border-b pb-2 pt-1 px-1 border-gray-100">
                  <div className="font-bold text-indigo-600">"{k}"</div>
                  <div className="col-span-2 text-gray-500 bg-gray-50 p-1.5 rounded text-[11px] truncate">
                    Node({node.value}) ── prev: <span className="text-purple-600 font-bold">{node.prev?.value || 'null'}</span> | next: <span className="text-purple-600 font-bold">{node.next?.value || 'null'}</span>
                  </div>
                  {/* <div className="col-span-2 text-gray-500 bg-gray-50 p-1.5 rounded text-[11px] truncate">
                    Node({node.value}) ── prev: <span className="text-purple-600 font-bold">{node.prev || 'null'}</span> | next: <span className="text-purple-600 font-bold">{node.next || 'null'}</span>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COMPONENT 2: DOUBLY LINKED LIST CHRONOLOGY */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-2 flex items-center gap-2">
              <span>⛓️</span> Doubly Linked List (Recency Order)
            </h2>
            <div className="flex gap-4 text-xs text-gray-500 mb-6 bg-slate-50 p-2 rounded">
              <div>
                <strong className="text-indigo-600">Head Pointer:</strong> {head ? `"${head}"` : 'null'}{' '}
                <span className="text-gray-400">(Most Recently Used)</span>
              </div>
              <div>
                <strong className="text-amber-600">Tail Pointer:</strong> {tail ? `"${tail}"` : 'null'}{' '}
                <span className="text-gray-400">(Least Recently Used)</span>
              </div>
            </div>

            {/* NODES VISUAL GRAPHICS CONTAINER */}
            {/* <ListCanvas {...{ orderedNodes, head, tail }} /> */}
            <LinkedListCanvas
              listNodes={lruCache.current.linkedList.getNodes()} 
              selectedListType={LinkedListType.Double}
            />
          </div>

          {/* REAL TIME CONSOLE EVENT LOGGER */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wide">Operation Lifecycle Logs</h3>
            <div className="bg-gray-900 rounded-lg p-3 h-32 overflow-y-auto text-xs font-mono text-emerald-400 space-y-1">
              {logs.map((log, i) => (
                <div key={i} className={i === 0 ? "text-white font-semibold border-l-2 border-indigo-400 pl-1.5" : "opacity-60 pl-2"}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LRUCacheVisualizer;

