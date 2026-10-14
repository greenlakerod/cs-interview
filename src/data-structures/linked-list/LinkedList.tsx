import { ILinkedList, ILinkedListNode } from ".";

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

  // public compareTo(value: T) {
  //   if (this.value > value) { return 1; }
  //   if (this.value < value) { return -1; }
  //   return 0;    
  // }
}

export class LinkedList<T> implements ILinkedList<T> {
  protected _count: number;
  protected _head: LinkedListNode<T> | null | undefined;
  protected _tail: LinkedListNode<T> | null | undefined;
  
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

  public addNode(node: LinkedListNode<T>, index?: number): boolean {
    if (!node) return false;
    if (index === undefined || index <= 0) {
      if (this._head) {
        node.next = this._head;
      }
      this._head = node;
      
      if (this._tail === null) {
        this._tail = this._head;
      }

      this._count++;
    } else if (index >= this._count) {
      if (this._head === null) {
        this._head = node;
      }
      if (this._tail) {
        this._tail.next = node;
      }
      this._tail = node;
      this._count++;
    } else {
      let current = this._head;
      let i = 0;

      while (current && ++i < index) {
        current = current.next;
      }

      if (current) {
        node.next = current.next;
        current.next = node;
        this._count++;
      }
    }

    return true;
  }

  public addFirst(value: T): boolean {
    return this.addNode(new LinkedListNode<T>(value), 0);
  }
  
  public addLast(value: T): boolean {
    return this.addNode(new LinkedListNode<T>(value), this._count);
  }

  public add(value: T, index?: number): boolean {
    if (this._head === null || index === undefined || index <= 0) {
      return this.addFirst(value);
    } else if (index >= this._count) {
      return this.addLast(value);
    }

    return this.addNode(new LinkedListNode<T>(value), index);
  }

  public removeFirst(): boolean {
    if (!this._head || this._count === 0) return false;
    if (this._count === 1) return this.clear();

    if (this._head.next) {
      this._head = this._head.next;
    } else {
      this._head = null;
    }
    
    this._count--;
    if (this._count === 1) {
      this._tail = this._head;
    }
    return true;
  }

  public removeLast(): boolean {
    if (!this._head || !this._tail || this._count === 0) return false;
    if (this._count === 1) return this.clear();

    let current: LinkedListNode<T> | null | undefined = this._head;
    while (current && current.next !== this._tail) {
      current = current.next;
    }

    if (current) {
      current.next = null;
    }
    this._tail = current;
    
    this._count--;
    if (this._count === 1) {
      this._head = this._tail;
    }

    return true;
  }

  public remove(index: number): boolean {
    if (index === undefined || index < 0 || index >= this._count) {
      throw "Invalid index";
    }
    if (!this._head || this._count === 0) return false;
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
    }

    return true;
  }

  public removeNode(node: LinkedListNode<T>): boolean {
    if (!node) return false;
    if (!this._head || !this._tail || !this._count) return false;

    if (this._head === node) {
      this._head = this._head.next;
    } else {
      let current: LinkedListNode<T> | null | undefined = this._head;
      while (current && current.next !== node) {
        current = current.next;
      }

      if (current && current.next) {
        if (current.next === node) {
          current.next = node.next;

          if (this._tail === node) {
            this._tail = current;
          }
        }
      }
    }

    this._count--;

    if (this._count === 1) {
      this._tail = this._head;
    } else if (this._count === 0) {
      this.clear();
    }

    return true;
  }

  public getNode(index: number): LinkedListNode<T> | null {
    if (!this._count || (index >= this._count) || (index < 0) || !this._head || !this._tail) return null;

    let current: LinkedListNode<T> | null | undefined = this._head;
    let i = 0;

    while (current) {
      if (i === index) return current;
      current = current.next;
      i++;
    }

    return null;
  }

  public getNodes(): Array<LinkedListNode<T> | null> {
    const arr: Array<ILinkedListNode<T> | null> = [];

    let current: LinkedListNode<T> | null | undefined = this._head;
    while (current) {
      arr.push(current);
      current = current.next;
    }

    return arr;
  }
  
  public clear(): boolean {
    this._head = null;
    this._tail = null;
    this._count = 0;
    return true;
  }

  // private getValues(node: LinkedListNode<T> | null | undefined = this._head) {
  //   const arr: T[] = [];

  //   let current: LinkedListNode<T> | null | undefined = node;
  //   while (current != null) {
  //     arr.push(current.value);
  //     current = current.next;
  //   }

  //   return arr;
  // }

  public reverse(
    // node: LinkedListNode<T> | null | undefined = this._head,
  ): LinkedListNode<T> | null | undefined {
    if (this._count <= 1 || !this._head || !this._tail) return null;

    let current: LinkedListNode<T> | null | undefined = this._head; // = node;
    let next: LinkedListNode<T> | null | undefined = null;
    let prev: LinkedListNode<T> | null | undefined = null;

    // let i = 0;
    // let h = this._head ? (this._head as LinkedListNode<T>).value : "NULL";
    // let c = current ? (current as LinkedListNode<T>).value : "NULL";
    // let n = next ? (next as LinkedListNode<T>).value : "NULL";
    // let p = prev ? (prev as LinkedListNode<T>).value : "NULL";
    // let t = this._tail ? (this._tail as LinkedListNode<T>).value : "NULL";
    // console.log(`{ ${i} - head: ${h}, previous: ${p}, current: ${c}, next: ${n}, tail: ${t}, list: [${this.getValues()}] }`);

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;

      if (current.next === null) {
        this._tail = current;
      }

      this._head = prev;

      // h = this._head ? this._head.value : "NULL";
      // c = current ? current.value : "NULL";
      // n = next ? next.value : "NULL";
      // p = prev ? prev.value : "NULL";
      // t = this._tail ? this._tail.value : "NULL";
      // console.log(`{ ${++i} - head: ${h}, previous: ${p}, current: ${c}, next: ${n}, tail: ${t}, list: [${this.getValues(current)}...${this.getValues(next)}] }`);

      current = next;
    }

    this._head = prev;
    
    // h = this._head ? (this._head as LinkedListNode<T>).value : "NULL";
    // c = current ? (current as LinkedListNode<T>).value : "NULL";
    // n = next ? (next as LinkedListNode<T>).value : "NULL";
    // p = prev ? (prev as LinkedListNode<T>).value : "NULL";
    // t = this._tail ? (this._tail as LinkedListNode<T>).value : "NULL";
    // console.log(`{ ${++i} - head: ${h}, previous: ${p}, current: ${c}, next: ${n}, tail: ${t}, list: [${this.getValues()}] }`);
    return this._head;
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