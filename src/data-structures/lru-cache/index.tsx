import DoublyLinkedList from "../linked-list/DoublyLinkedList";
import { LinkedListNode } from "../linked-list/LinkedList";

export class LRUCache<T> {
  private _capacity: number;
  private _map: { [key: string]: LinkedListNode<T> };
  private _linkedList: DoublyLinkedList<T>;
  
  constructor(capacity: number) {
    if (capacity <= 0) throw "Capacity must be greater than zero";

    this._capacity = capacity;
    this._map = {};
    this._linkedList = new DoublyLinkedList<T>();
  }

  public get map() { return this._map; }

  public get linkedList() { return this._linkedList; }

  public get capacity() { return this._capacity; }

  private addToHead(node: LinkedListNode<T>): void {
    this._linkedList.addNode(node, 0);
  }

  private removeNode(node: LinkedListNode<T>): void {
    this._linkedList.removeNode(node);
  }

  private removeTail(): void {
    if (!this._linkedList.tail) return;

    const temp = this._linkedList.tail;
    if (temp.key) {
      delete this._map[temp.key];
    }

    if (this._linkedList.count === 1) {
      this._linkedList.clear();
    } else {
      this._linkedList.removeLast();
    }
  }

  private moveToHead(node: LinkedListNode<T>): void {
    if (node === this._linkedList.head) return;

    this.removeNode(node);
    this.addToHead(node);
  }

  public get(key: string): T | undefined {
    if (!Object.keys(this._map).includes(key)) return undefined;

    const node = this._map[key];
    this.moveToHead(node);

    return node.value;
  }

  public set(key: string, value: T): void {
    const keys = Object.keys(this._map);
    if (keys.includes(key)) {
      const node = this._map[key];
      node.value = value;
      this.moveToHead(node);
    } else {
      const newNode = new LinkedListNode<T>(value);
      newNode.key = key;

      if (keys.length >= this._capacity) {
        this.removeTail();
      }

      this.addToHead(newNode);
      this._map[key] = newNode;
    }
  }

  public setCapacity(capacity: number): void {
    if (capacity < 1) {
      throw "Capacity must be greater than 1";
    }

    this._capacity = capacity;

    let keys = Object.keys(this._map);
    while (keys.length > this._capacity) {
      this.removeTail();
      keys = Object.keys(this._map);
    }
  }

  public clear(): void {
    this._linkedList.clear();
    this._map = {};
  }
}