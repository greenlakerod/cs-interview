import { LinkedListStack } from "@src/data-structures/stack/linked-list-stack";
import { BinaryTreeNode } from ".";
import { LinkedListQueue } from "@src/data-structures/queue/linked-list-queue";

export enum TreeTraversal {
  InOrder = "inorder",
  PreOrder = "preorder",
  PostOrder = "postorder",
  LevelOrder = "levelorder",
}

export type InOrderNodeType = "L" | "R" | "Root" | "Any";

export enum InOrderNodeTypeEnum {
  Root = "Root",
  Left = "L",
  Right = "R",
  Any = "Any",
}

export type SerializerFunction = (
  node: BinaryTreeNode<any> | null,
  recursive?: boolean,
) => string;
export type DeserializerFunction = (
  data: string,
  recursive?: boolean,
) => BinaryTreeNode<any> | null;

export interface IStaticSerializer {
  serialize: SerializerFunction;
  deserialize: DeserializerFunction;
}

interface IBaseSerializer {}

const NULL_MARKER = "#";
const DELIMITER = ",";

enum TreeNodeDeserializationState {
  ExpectingLeftChild = 0,
  ExpectingRightChild = 1,
}

interface TreeNodeWithState {
  node: BinaryTreeNode<number>;
  state: TreeNodeDeserializationState,
}

export const PreOrderSerializer: IStaticSerializer = class implements IBaseSerializer {
  static serialize(
    root: BinaryTreeNode<any> | null,
    recursive?: boolean,
  ): string {
    const output: string[] = [];
    if (recursive) {
      function traverse(node: BinaryTreeNode<any> | null): void {
        if (!node) {
          output.push(NULL_MARKER);
          return;
        }

        output.push(node.value);
        traverse(node.left);
        traverse(node.right);
      }

      traverse(root);
    } else {
      const stack = new LinkedListStack<BinaryTreeNode<any>>();
      let n: BinaryTreeNode<any> | null = root;

      do {
        while (n) {
          stack.push(n);
          output.push(n.value);

          n = n.left;
        }

        output.push(NULL_MARKER);

        if (stack.size > 0) {
          n = stack.pop() as BinaryTreeNode<any>;
          n = n.right;
        }
      } while (stack.size > 0 || n);
    }

    return output.join(DELIMITER);
  }

  static deserialize(
    data: string,
    recursive?: boolean,
  ): BinaryTreeNode<number> | null {
    if (!data || data === NULL_MARKER) return null;
    const tokens = data.split(DELIMITER);

    if (recursive) {
      let index = 0;

      function build(): BinaryTreeNode<number> | null {
        if (index >= tokens.length) return null;
        const token = tokens[index++];
        if (token === NULL_MARKER) return null;

        const node = new BinaryTreeNode<number>(parseInt(token, 10));
        node.left = build();
        node.right = build();
        return node;
      }

      return build();
    } else {
      const root = new BinaryTreeNode<number>(parseInt(tokens[0], 10));
      const stack = new LinkedListStack<TreeNodeWithState>();
      stack.push({ node: root, state: TreeNodeDeserializationState.ExpectingLeftChild });

      let index = 1;
      while (index < tokens.length && stack.size > 0) {
        const top = stack.peek();
        const token = tokens[index++];
        const childNode = token === NULL_MARKER ? null : new BinaryTreeNode<number>(parseInt(token, 10));

        if (top) {
          if (top.state === TreeNodeDeserializationState.ExpectingLeftChild) {
            top.node.left = childNode;
            top.state = TreeNodeDeserializationState.ExpectingRightChild;
          } else {
            top.node.right = childNode;
            stack.pop();
          }

          if (childNode) {
            stack.push({ node: childNode, state: TreeNodeDeserializationState.ExpectingLeftChild });
          }
        }
      }

      return root;
    }
  }
};

export const PostOrderSerializer: IStaticSerializer = class implements IBaseSerializer {
  static serialize(
    root: BinaryTreeNode<any> | null,
    recursive?: boolean,
  ): string {
    let output: string[] = [];

    if (recursive) {
      function traverse(node: BinaryTreeNode<any> | null): void {
        if (!node) {
          output.push(NULL_MARKER);
          return;
        }

        traverse(node.left);
        traverse(node.right);
        output.push(node.value);
      }

      traverse(root);
    } else {
      if (!root) {
        return NULL_MARKER;
      }
      const stack = new LinkedListStack<BinaryTreeNode<any> | null>();
      stack.push(root);

      // get elements: root > right > left
      while (stack.size > 0) {
        const node = stack.pop();
        if (!node) {
          output.push(NULL_MARKER);
          continue;
        }

        output.push(node.value.toString());
        stack.push(node.left);
        stack.push(node.right);
      }

      // reverse results to left > right > root
      output = output.reverse();
    }

    return output.join(DELIMITER);
  }

  static deserialize(
    data: string,
    recursive?: boolean,
  ): BinaryTreeNode<number> | null {
    if (!data || data === NULL_MARKER) return null;
    const tokens = data.split(DELIMITER);
    let index = 0;

    if (recursive) {
      function build(): BinaryTreeNode<number> | null {
        if (index >= tokens.length) return null;
        const token = tokens[index++];
        if (token === NULL_MARKER) return null;

        const node = new BinaryTreeNode<number>(parseInt(token, 10));
        node.right = build();
        node.left = build();

        return node;
      }

      return build();
    } else {
      let index = tokens.length - 1;
      const root = new BinaryTreeNode<number>(parseInt(tokens[index--], 10));
      const stack = new LinkedListStack<TreeNodeWithState>();
      stack.push({ node: root, state: TreeNodeDeserializationState.ExpectingRightChild });

      while (index >= 0 && stack.size > 0) {
        const top = stack.peek();
        const token = tokens[index--];
        const childNode = token === NULL_MARKER ? null : new BinaryTreeNode<number>(parseInt(token, 10));

        if (top) {
          if (top.state === TreeNodeDeserializationState.ExpectingRightChild) {
            top.node.right = childNode;
            top.state = TreeNodeDeserializationState.ExpectingLeftChild;
          } else {
            top.node.left = childNode;
            stack.pop();
          }

          if (childNode) {
            stack.push({ node: childNode, state: TreeNodeDeserializationState.ExpectingRightChild });
          }
        }
      }

      return root;
    }
  }
}

export const LevelOrderSerializer: IStaticSerializer = class implements IBaseSerializer {
  static serialize(
    root: BinaryTreeNode<any> | null,
    // recursive?: boolean,
  ): string {
    if (!root) return NULL_MARKER;
    const output: string[] = [];
    const queue = new LinkedListQueue<BinaryTreeNode<any> | null>();
    
    queue.enqueue(root);
    while (queue.count > 0) {
      const current = queue.dequeue();
      if (current) {
        output.push(current.value.toString());
        queue.enqueue(current.left);
        queue.enqueue(current.right);
      } else {
        output.push(NULL_MARKER);
      }
    }

    return output.join(DELIMITER);
  }

  static deserialize(
    data: string,
    // recursive?: boolean,
  ): BinaryTreeNode<number> | null {
    if (!data || data === NULL_MARKER) return null;
    const tokens = data.split(DELIMITER);

    const queue = new LinkedListQueue<BinaryTreeNode<number> | null>();
    const root = new BinaryTreeNode<number>(parseInt(tokens[0], 10));
    queue.enqueue(root);

    let index = 1;
    while (queue.count > 0 && index < tokens.length) {
      const parent = queue.dequeue();

      if (!parent) {
        break;
      }

      if (index < tokens.length) {
        const leftToken = tokens[index++];
        if (leftToken !== NULL_MARKER) {
          parent.left = new BinaryTreeNode<number>(parseInt(leftToken, 10));
          queue.enqueue(parent.left);
        }
      }

      if (index < tokens.length) {
        const rightToken = tokens[index++];
        if (rightToken !== NULL_MARKER) {
          parent.right = new BinaryTreeNode<number>(parseInt(rightToken, 10));
          queue.enqueue(parent.right);
        }
      }
    }

    return root;
  }
}

export const InOrderSerializer: IStaticSerializer = class implements IBaseSerializer {
  static serialize(
    root: BinaryTreeNode<any> | null,
    recursive?: boolean,
  ): string {
    const result: string[] = [];

    if (recursive) {
      function traverse(node: BinaryTreeNode<any> | null, type: InOrderNodeType | InOrderNodeTypeEnum) {
        if (!node) {
          result.push(`${NULL_MARKER}/${type}`);
          return;
        }
        traverse(node.left, InOrderNodeTypeEnum.Left);
        result.push(`${node.value}/${type}`);
        traverse(node.right, InOrderNodeTypeEnum.Right);
      }

      traverse(root, InOrderNodeTypeEnum.Root);
    } else {
      const stack = new LinkedListStack<{ node: BinaryTreeNode<any> | null | undefined, id: number }>();
      let current: BinaryTreeNode<any> | null | undefined = root;
      let currId = 1;

      while (current !== null || stack.size > 0) {
        // Travel to the absolute left of the sub-branch
        while (current !== null) {
          stack.push({ node: current, id: currId });
          current = current?.left;
          currId = 2 * currId;
        }

        // Hit a null slot at the end of the left run
        result.push(`${currId}:${NULL_MARKER}`);

        const poppedItem = stack.pop();
        if (poppedItem) {
          result.push(`${poppedItem.id}:${poppedItem.node?.value}`);

          // go right child branch
          current = poppedItem.node?.right;
          currId = 2 * poppedItem.id + 1;
        }

        result.push(`${currId}:${NULL_MARKER}`);
      }
    }

    return result.join(DELIMITER);
  }

  static deserialize(
    data: string,
    recursive?: boolean,
  ): BinaryTreeNode<number> | null {
    if (!data || data === NULL_MARKER) return null;
    const tokens = data.split(DELIMITER);

    if (recursive) {
      const nodes: { 
        isLink: boolean, 
        val: number | null, 
        type: InOrderNodeType | InOrderNodeTypeEnum,
      }[] = tokens.map((token) => {
        const [valStr, type] = token.split("/");
        return {
          type: type as InOrderNodeType,
          isLink: valStr !== NULL_MARKER,
          val: valStr !== NULL_MARKER ? parseInt(valStr, 10) : null,
        };
      });

      let index = 0;

      function build(parentType: InOrderNodeType | InOrderNodeTypeEnum): BinaryTreeNode<number> | null {
        if (index >= nodes.length) return null;

        // Peek at upcoming item to see if it belongs to the active branch
        const nextNode = nodes[index];
        if (!nextNode.isLink) {
          index++;
          return null;
        }

        const node = new BinaryTreeNode<number>(nextNode.val!);

        // increment index before recursive calls
        index++;

        // build the subtrees
        node.left = build(InOrderNodeTypeEnum.Left);
        node.right = build(InOrderNodeTypeEnum.Right);

        return node;
      }

      return build(InOrderNodeTypeEnum.Any);
    } else {
      const nodeMap = new Map<number, BinaryTreeNode<number>>();
      const posKeys: number[] = [];

      // set map
      for (let i = 0; i < tokens.length; i++) {
        const [posStr, valStr] = tokens[i].split(":");
        const posId = parseInt(posStr, 10);
        if (valStr !== NULL_MARKER) {
          nodeMap.set(posId, new BinaryTreeNode<number>(parseInt(valStr, 10)));
          posKeys.push(posId);
        }
      }

      if (nodeMap.size === 0) return null;

      for (let i = 0; i < posKeys.length; i++) {
        const parentId = posKeys[i];
        const parentNode = nodeMap.get(parentId);

        const leftId = 2 * parentId;
        const rightId = 2 * parentId + 1;

        if (nodeMap.has(leftId)) {
          parentNode!.left = nodeMap.get(leftId) as BinaryTreeNode<number>;
        }
        if (nodeMap.has(rightId)) {
          parentNode!.right = nodeMap.get(rightId) as BinaryTreeNode<number>;
        }
      }

      return nodeMap.get(1) || null;
    }
  }
}
