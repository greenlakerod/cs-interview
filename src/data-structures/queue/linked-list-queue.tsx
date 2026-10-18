import { Queue } from ".";
import { LinkedList } from "../linked-list/LinkedList";

export class LinkedListQueue<T> extends Queue<T> {
  private _list: LinkedList<T>;
  private _slots: Array<boolean>;

  constructor() {
    super();

    this._list = new LinkedList<T>();
    this._slots = [];
  }

  public get count() { return this._list.count; }

  public get items(): Array<T> { 
    return this._list.getNodes().map(n => n?.value as T);
  }

  public get slots(): Array<boolean> {
    return this._slots;
  }

  public enqueue(item: T): void {
    if (this._list.count >= this._slots.length) {
      this._slots.push(true);
    }
    this._list.addLast(item);
  }

  public dequeue(): T | null | undefined {
    if (this.count === 0) {
      throw "Queue is empty";
    }

    const value = this._list.head?.value as T;
    this._list.removeFirst();
    this._slots.splice(this._slots.length - 1, 1);

    return value;
  }

  public peek(): T | null | undefined {
    if (this.count === 0) {
      return null;
    }

    return this._list.head?.value;
  }

  public clear(): void {
    this._list.clear();
    this._slots = []; // this._slots.splice(0);
  }
}