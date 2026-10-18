import { INode } from "../common";

export interface ILinkedListNode<T> extends INode<T> {
  key?: string;
  next?: ILinkedListNode<T> | null;
  prev?: ILinkedListNode<T> | null;  
}

export interface ILinkedList<T> {
  head?: ILinkedListNode<T> | null | undefined;
  tail?: ILinkedListNode<T> | null | undefined;
  values?: T[];
  count: number;

  add: (value: T, index?: number) => boolean;
  addFirst: (value: T) => boolean;
  addLast: (value: T) => boolean;
  addNode: (node: ILinkedListNode<T>, index?: number) => boolean;

  remove: (index: number) => boolean;
  removeFirst: () => boolean;
  removeLast: () => boolean;
  removeNode: (node: ILinkedListNode<T>) => boolean;

  getNode: (index: number) => ILinkedListNode<T> | null;
  getNodes: () => Array<ILinkedListNode<T> | null>;

  clear: () => boolean;
  contains: (value: T) => boolean;
  copyTo: (array: Array<any>, arrayIndex?: number) => void;
  reverse: (node?: ILinkedListNode<T>) => ILinkedListNode<T> | null | undefined;
  // sort: (descending?: boolean) => void;
}

export type ListNodePtr<T> = { ptr?: ILinkedListNode<T> };

