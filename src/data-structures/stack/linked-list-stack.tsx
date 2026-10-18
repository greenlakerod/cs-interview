import { Stack } from ".";
import { LinkedList } from "../linked-list/LinkedList";

export class LinkedListStack<T> extends Stack<T> {
  private _list: LinkedList<T>;
  private _slots: Array<boolean>;

  constructor() {
    super();

    this._list = new LinkedList<T>();
    this._slots = [];
  }

  public get size() { return this._list.count; }

  public get slots() { return this._slots; }

  public get items() {
    if (!this.size) { return []; }

    let a: Array<T> = new Array<T>(this.size);
    this._list.copyTo(a);

    return a;
  }

  public push(item: T): void {
    this._slots.push(true);
    this._list.addFirst(item);
  }

  public pop(): T | null | undefined {
    if (this.size === 0) {
      throw "Stack is empty";
    }

    let value: T | null | undefined = this._list.head?.value;
    this._list.removeFirst();

    this._slots.splice(this._slots.length - 1);
    return value;
  }

  public peek(): T | null | undefined {
    if (this.size === 0) {
      return null;
    }

    return this._list.head?.value;
  }

  public clear(): void {
    this._list.clear();
    this._slots.splice(0);
  }
}