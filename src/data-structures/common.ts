export interface IComparable<T> {
  // compareTo: (value: T) => number;
}

export interface INode<T> extends IComparable<T> {
  value: T;
}
