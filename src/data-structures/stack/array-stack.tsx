import { Stack } from ".";

export class ArrayStack<T> extends Stack<T> {
  private _items: Array<T>;
  private _slots: Array<boolean>;
  private _size: number;

  constructor() {
    super();

    this._items = [];
    this._slots = [];
    this._size = 0;
  }

  public get size(): number { return this._size; }
  public get items(): Array<T> { return this._items; }
  public get slots(): Array<boolean> { return this._slots; }

  public push(item: T): void {
    if (this._size === this._items.length) {
      let newLength = this._size === 0 ? 4 : this._size * 2;
      let newArray = new Array<T>(newLength);
      this._slots = new Array<boolean>(newLength).fill(false);

      if (this._size === 0) {
        this._items[0] = item;
      }

      for (let i = 0; i < this._items.length; i++) {
        newArray[i] = this._items[i];
        this._slots[i] = true;
      }

      this._items = newArray;
    }

    this._slots[this._size] = true;
    this._items[this._size++] = item;
  }

  public pop(): T | null | undefined {
    if (this._size === 0) {
      throw "Stack is empty";
    }

    this._slots[this._size - 1] = false;
    return this._items[--(this._size)];
  }

  public peek(): T | null | undefined {
    if (this._size === 0) {
      return null;
    }

    return this._items[this._size - 1];
  }

  public clear(): void {
    this._size = 0;
    this._slots.splice(0);
    this._items.splice(0);
  }
}