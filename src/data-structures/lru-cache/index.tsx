import { LinkedList, LinkedListNode } from "../linked-list";

export class LRUCache<T> {
  private _capacity: number;
  private _map: { [key: string]: LinkedListNode<T> };
  private _linkedList: LinkedList<T>;
  
  constructor(capacity: number) {
    if (capacity <= 0) throw "Capacity must be greater than zero";

    this._capacity = capacity;
    this._map = {};
    this._linkedList = new LinkedList<T>();
  }

  private addToHead(node: LinkedListNode<T>): void {}

  private removeNode(node: LinkedListNode<T>): void {}

  private removeTail(): void {}
}