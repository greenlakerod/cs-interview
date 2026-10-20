import { INode } from "@src/data-structures/common";
// import { LinkedListStack } from "@src/data-structures/stack/linked-list-stack";
import { InOrderSerializer, IStaticSerializer, LevelOrderSerializer, PostOrderSerializer, PreOrderSerializer, TreeTraversal } from "./serializer";

export type NodeValueComparer<T> = (v1: T, v2: T) => number;

export interface IBinaryTreeNode<T> extends INode<T> {
  value: T;
  left: IBinaryTreeNode<T> | null;
  right: IBinaryTreeNode<T> | null;
  height: number;
  width: number;
}

export interface IBinaryTree<T> {
  root: IBinaryTreeNode<T> | null;
  height: number;
  width: number;
  count: number;
  comparer: NodeValueComparer<T> | undefined;
  // treeView: Array<BootstrapTreeViewNodeData>;
  add: (value: T) => void;
  remove: (value: T) => void;
  find: (value: T) => IBinaryTreeNode<T> | null;
  clear: () => void;

  // serialize: (order: TreeTraversal, nodes: Array<any>, recursive?: boolean) => void;
  serialize: (order: TreeTraversal, recursive?: boolean) => string;
  
  // deserialize: (order: TreeTraversal, nodes: Array<any>, levelOrderNodes?: Array<any>) => void;
  deserialize: (order: TreeTraversal, data: string, recursive?: boolean) => void;
  // compareNodes: (v1: T, v2: T, fn: (v1: T, v2: T) => number) => number;
}

export class BinaryTreeNode<T> implements IBinaryTreeNode<T> {
  public value: T;
  public left: BinaryTreeNode<T> | null;
  public right: BinaryTreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  public get height(): number {
    let leftHeight = this.left ? this.left.height : 0;
    let rightHeight = this.right ? this.right.height : 0;

    return 1 + Math.max(leftHeight, rightHeight);
  }
  
  public get width(): number {
    return this._nodeWidth(this, this.height);
  }

  private _nodeWidth(node: BinaryTreeNode<T> | null, level: number): number {
    if (!node) { return 0; }
    if (level == 1) { return 1; }

    let leftWidth = this._nodeWidth(node.left, level - 1);
    let rightWidth = this._nodeWidth(node.right, level - 1);

    return leftWidth + rightWidth;
  }
}

export abstract class BinaryTree<T> implements IBinaryTree<T> {
  protected _root: BinaryTreeNode<T> | null;
  // protected _treeView: Array<BootstrapTreeViewNodeData> = [];
  protected _count: number;

  constructor() {
    this._root = null;
    this._count = 0;
  }
  
  public get root(): BinaryTreeNode<T> | null { return this._root; }
  public get height(): number { return this._root ? this._root.height : 0; }
  public get width(): number { return this._root ? this._root.width : 0; }
  // public get treeView(): Array<BootstrapTreeViewNodeData> { return this._treeView; }
  public get count(): number { return this._count; }

  public comparer: ((v1: T, v2: T) => number) | undefined;

  public abstract add(value: T): void;
  public abstract remove(value: T): void;
  public abstract find(value: T): BinaryTreeNode<T> | null;

  // public abstract deserialize(order: TreeTraversal, nodes: Array<any>, levelOrderNodes?: Array<any>): void;
  public deserialize(order: TreeTraversal, data: string, recursive?: boolean): void {
    let serializer: IStaticSerializer;

    switch (order) {
      case TreeTraversal.InOrder:
        serializer = InOrderSerializer; break;
      case TreeTraversal.LevelOrder:
        serializer = LevelOrderSerializer; break;
      case TreeTraversal.PostOrder:
        serializer = PostOrderSerializer; break;
      case TreeTraversal.PreOrder:
      default:
        serializer = PreOrderSerializer; break;
    }

    this._root = serializer.deserialize(data, recursive);    
  }

  // depth first: http://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/
  // breadth first: http://www.geeksforgeeks.org/?p=2686
  // public serialize(order: TreeTraversal, nodes: Array<T>, recursive: boolean = true): void {
  //   let fn: ((node: BinaryTreeNode<T> | null, nodes: Array<T>, recursive: boolean) => void) | undefined = undefined;

  //   switch (order) {
  //     case TreeTraversal.InOrder: fn = this.serializeInOrder; break;
  //     case TreeTraversal.PreOrder: fn = this.serializePreOrder; break;
  //     case TreeTraversal.PostOrder: fn = this.serializePostOrder; break;
  //     case TreeTraversal.LevelOrder: fn = this.serializeLevelOrder; break;
  //     default: break;
  //   }

  //   if (fn !== undefined) {
  //     fn.call(this, this._root, nodes, recursive);
  //     console.log(`traversal (${order}): ${nodes}`);
  //   }
  // }
  public serialize(order: TreeTraversal, recursive?: boolean): string {
    let serializer: IStaticSerializer;

    switch (order) {
      case TreeTraversal.InOrder:
        serializer = InOrderSerializer; break;
      case TreeTraversal.LevelOrder:
        serializer = LevelOrderSerializer; break;
      case TreeTraversal.PostOrder:
        serializer = PostOrderSerializer; break;
      case TreeTraversal.PreOrder:
      default:
        serializer = PreOrderSerializer; break;
    }

    return serializer.serialize(this.root, recursive);
  }

  public clear(): void {
    this.clearTree(this._root);
    this._root = null; //delete this._root;
    this._count = 0;
    // this._treeView = [];
  }

  public clearTree(node: BinaryTreeNode<T> | null): void {
    if (node !== null) {
      this.clearTree(node.left);
      node.left = null; // delete node.left;

      this.clearTree(node.right);
      node.right = null; // delete node.right;

      node = null;
    }
  }

  // public compareNodes(v1: T, v2: T, fn: (v1: T, v2: T) => number): number {
  //   return fn(v1, v2);
  // }

  // protected serializeInOrder(node: BinaryTreeNode<T> | null, output: Array<T>, recursive: boolean): void {
  //   if (node) {
  //     if (recursive) {
  //       this.serializeInOrder(node.left, output, recursive);
  //       output.push(node.value);
  //       this.serializeInOrder(node.right, output, recursive);
  //     } else {
  //       let stack: LinkedListStack<BinaryTreeNode<T>> = new LinkedListStack<BinaryTreeNode<T>>();
  //       let n: BinaryTreeNode<T> | null | undefined = node;

  //       do {
  //         while (n) {
  //           stack.push(n);
  //           n = n.left;
  //         }
  //         if (stack.size > 0) {
  //           n = stack.pop();
  //           output.push(n?.value as T);

  //           n = n?.right;
  //         }
  //       } while (stack.size > 0 || n);
  //     }
  //   }
  // }

  // protected serializePreOrder(
  //   node: BinaryTreeNode<T> | null, 
  //   output: Array<T>, 
  //   recursive: boolean,
  // ): void {
  //   if (node) {
  //     if (recursive) {
  //       output.push(node.value);
  //       this.serializePreOrder(node.left, output, recursive);
  //       this.serializePreOrder(node.right, output, recursive);
  //     } else {
  //       let stack: LinkedListStack<BinaryTreeNode<T>> = new LinkedListStack<BinaryTreeNode<T>>();
  //       let n: BinaryTreeNode<T> | null | undefined = node;

  //       do {
  //         while (n) {
  //           stack.push(n);
  //           output.push(n.value);

  //           n = n.left;
  //         }
  //         if (stack.size > 0) {
  //           n = stack.pop();
  //           n = n?.right;
  //         }
  //       } while (stack.size > 0 || n);
  //     }
  //   }
  // }

  // protected serializePostOrder(node: BinaryTreeNode<T> | null, output: Array<T>, recursive: boolean): void {
  //   if (node) {
  //     if (recursive) {
  //       this.serializePostOrder(node.left, output, recursive);
  //       this.serializePostOrder(node.right, output, recursive);
  //       output.push(node.value);
  //     } else {
  //       let stack: LinkedListStack<BinaryTreeNode<T>> = new LinkedListStack<BinaryTreeNode<T>>();
  //       let n: BinaryTreeNode<T> | null | undefined = node;
  //       let prev: BinaryTreeNode<T> | null | undefined;

  //       do {
  //         while (n) {
  //           stack.push(n);
  //           n = n.left;
  //         }
  //         while (!n && stack.size > 0) {
  //           n = stack.peek();
  //           if (!n?.right || n.right == prev) {
  //             output.push(n?.value as T);
  //             stack.pop();

  //             prev = n;
  //             n = null; // undefined;
  //           } else {
  //             n = n.right;
  //           }
  //         }
  //       } while (stack.size > 0);
  //     }
  //   }
  // }

  // protected serializeLevelOrder(node: BinaryTreeNode<T> | null, output: Array<T>, recursive: boolean): void {
  //   for (let i = 1; i <= this.height; i++) {
  //     this._serializeLevelOrder(this._root, output, i);
  //   }
  // }

  // protected _serializeLevelOrder(node: BinaryTreeNode<T> | null, output: Array<T>, level: number): void {
  //   if (node) {
  //     if (level === 1) {
  //       output.push(node.value);
  //     } else if (level > 1) {
  //       this._serializeLevelOrder(node.left, output, level - 1);
  //       this._serializeLevelOrder(node.right, output, level - 1);
  //     }
  //   }
  // }
}