//https://www.cs.cmu.edu/~adamchik/15-121/lectures/Sorting%20Algorithms/sorting.html
//https://www.toptal.com/developers/sorting-algorithms

export interface ISortIteration {
  iteration: number;
  message?: string;
  array: Array<any>;
  startIndex?: number;
  endIndex?: number;
}

export interface ISortResult {
  comparisons: number;
  swaps: number;
  iterations: Array<ISortIteration>;
}

export interface ISortAlgorithm {
  sort(items: Array<any>): void;
}

export abstract class Sorter<T> implements ISortAlgorithm {
  protected _results: ISortResult;
  public get results() { return this._results; }

  protected _log: Array<string>;
  public get log() { return this._log; }

  constructor() {
    this._log = [];

    this._results = {
      comparisons: 0,
      swaps: 0,
      iterations: [],
    };
  }

  protected __log(entry: string): void {
    this._log.push(entry);
  }

  protected _swap(items: Array<T>, left: number, right: number): void {
    let temp: T = items[left];
    items[left] = items[right];
    items[right] = temp;
  }

  protected _copy(items: Array<T>, target: Array<T>, start: number, end: number): void {
    for (let i = start; i < end; i++) {
      target.push(items[i]);
    }
  }

  public abstract sort(items: Array<T>): void;

  public clear() {
    this._log = [];
    this._results = {
      comparisons: 0,
      swaps: 0,
      iterations: [],
    };
  }
}