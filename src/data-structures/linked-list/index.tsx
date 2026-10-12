import { INode } from "../common";

export interface ILinkedListNode<T> extends INode<T> {
  key?: string;
  next?: ILinkedListNode<T> | null;
  prev?: ILinkedListNode<T> | null;  
}

export type ListNodePtr<T> = { ptr?: ILinkedListNode<T> };

export class LinkedListNode<T> implements ILinkedListNode<T> {
  key?: string | undefined;
  next?: LinkedListNode<T> | null | undefined;
  prev?: LinkedListNode<T> | null | undefined;
  value: T;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
    this.key = undefined;
  }

  public compareTo(value: T) {
    if (this.value > value) { return 1; }
    if (this.value < value) { return -1; }
    return 0;    
  }
}

export interface ILinkedList<T> {
  head?: ILinkedListNode<T> | null | undefined;
  tail?: ILinkedListNode<T> | null | undefined;
  values?: T[];
  count: number;

  add: (value: T, index?: number) => void;
  addFirst: (value: T) => void;
  addLast: (value: T) => void;

  remove: (index: number) => boolean;
  removeFirst: () => boolean;
  removeLast: () => boolean;

  clear: () => void;
  contains: (value: T) => boolean;
  // copyTo: (array: Array<any>, arrayIndex?: number) => void;
  reverse: () => void;
  // sort: (descending?: boolean) => void;
}

export class LinkedList<T> implements ILinkedList<T> {
  private _count: number;
  private _head: LinkedListNode<T> | null | undefined;
  private _tail: LinkedListNode<T> | null | undefined;
  
  constructor(values?: T[]) {
    this._head = null;
    this._tail = null;

    if (values?.length) {
      values.forEach((v, i) => {
        if (i === 0) {
          this.addFirst(v);
        } else {
          this.addLast(v);
        }
      });
    }

    this._count = values ? values.length : 0;
  }

  public get count(): number {
    return this._count;
  }

  public get head(): LinkedListNode<T> | null | undefined { 
    return this._head;
  }

  public get tail(): LinkedListNode<T> | null | undefined { 
    return this._tail;
  }

  public get values(): T[] {
    const arr: T[] = [];
    
    let current: LinkedListNode<T> | null | undefined = this._head;
    while (current != null) {
      arr.push(current.value);
      current = current.next;
    }

    return arr;
  }

  public addFirst(value: T): void {
    const newNode = new LinkedListNode(value);
    if (this._head) {
      newNode.next = this._head;
    }
    this._head = newNode;
    
    if (this._tail === null) {
      this._tail = this._head;
    }

    this._count++;
  }
  
  public addLast(value: T): void {
    const newNode = new LinkedListNode(value);

    if (this._head === null) {
      this._head = newNode;
    }
    if (this._tail) {
      this._tail.next = newNode;
    }
    this._tail = newNode;
    this._count++;
  }

  public add(value: T, index?: number): void {
    if (this._head === null || index === undefined || index <= 0) {
      this.addFirst(value);
    } else if (index >= this._count) {
      this.addLast(value);
    } else {
      let current: LinkedListNode<T> | null | undefined = this._head;
      let i = 0;

      while (current && ++i < index) {
        current = current.next;
      }

      if (current) {
        const newNode: LinkedListNode<T> = new LinkedListNode<T>(value);

        newNode.next = current.next;
        current.next = newNode;
        this._count++;
      }
    }
  }

  public removeFirst(): boolean {
    if (this._count === 0) return false;
    if (this._count === 1) {
      this._head = null;
      this._tail = null;
      this._count = 0;

      return true;
    } 
    if (this._head && this._head.next) {
      if (this._head.next) {
        this._head = this._head.next;
      } else {
        this._head = null;
      }
      
      this._count--;
      return true;
    }

    return false;
  }

  public removeLast(): boolean {
    if (this._count === 0) return false;
    if (this._count === 1) {
      this._head = null;
      this._tail = null;
      this._count = 0;

      return true;
    } else {
      let current: LinkedListNode<T> | null | undefined = this._head;
      while (current && current.next !== this._tail) {
        current = current.next;
      }
      if (current) {
        current.next = null;
      }

      this._tail = current;
      this._count--;
      return true;
    }

    return false;
  }

  public remove(index: number): boolean {
    if (index === undefined || index < 0 || index >= this._count) {
      throw "Invalid index";
    }
    if (this._count === 0) return false;
    if (index === 0) return this.removeFirst();
    if (index === this._count - 1) return this.removeLast();

    let current: LinkedListNode<T> | null | undefined = this._head;
    let i = 0;
    while (current && ++i < index) {
      current = current.next;
    }

    if (current && current.next) {
      current.next = current.next.next;
      this._count--;

      return true;
    }

    return false;
  }
  
  public clear(): void {
    this._head = null;
    this._tail = null;
    this._count = 0;
  }

  public reverse(): void {
    if (this._count === 0) return;

    let current = this._head;
    let next: LinkedListNode<T> | null | undefined = null;
    let prev: LinkedListNode<T> | null | undefined = null;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;

      if (current.next === null) {
        this._tail = current;
      }

      current = next;
    }

    this._head = prev;
  }

  public contains(value: T): boolean {
    let current = this._head;
    while (current) {
      if (current.value === value) return true;
      current = current.next;
    }

    return false;
  }

  // sort: (descending?: boolean) => void;
}
