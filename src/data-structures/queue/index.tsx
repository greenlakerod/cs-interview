export interface IQueue {
  count: number;
  items: Array<any>;
  slots: Array<boolean>;
  enqueue: (item: any) => void;
  dequeue: () => void;
  peek: () => any;
  clear: () => void;
}

export abstract class Queue<T> implements IQueue {
  public abstract count: number;
  public abstract items: Array<T>;
  public abstract slots: Array<boolean>;
  public abstract enqueue(item: T): void;
  public abstract dequeue(): T | null | undefined;
  public abstract peek(): T | null | undefined;
  public abstract clear(): void;
}