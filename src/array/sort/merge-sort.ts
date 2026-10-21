import { Sorter } from ".";

export class MergeSort<T> extends Sorter<T> {
  public sort(items: Array<T>): void {
    this._sort(1, items, 0, items.length - 1, "original string");
  }

  private _merge(iteration: number, items: Array<T>, left: Array<T>, right: Array<T>): void {
    this.__log(`call merge (${iteration}): items: ${items}, left: ${left}, right: ${right}`);

    let leftIndex = 0;
    let rightIndex = 0;
    let targetIndex = 0;
    let remaining = left.length + right.length;

    while (remaining > 0) {
      if (leftIndex >= left.length) {
        items[targetIndex++] = right[rightIndex++];
      } else if (rightIndex >= right.length) {
        items[targetIndex++] = left[leftIndex++];
      } else {
        if (left[leftIndex] < right[rightIndex]) {
          items[targetIndex++] = left[leftIndex++];
        } else {
          items[targetIndex++] = right[rightIndex++];
        }

        this._results.comparisons++;
      }

      this._results.swaps++;
      remaining--;
    }

    this._results.iterations.push({
      iteration,
      array: items,
      message: "merged",
    });

    this.__log(`merged (${iteration}): items: ${items}`);
  }

  private _sort(iteration: number, items: Array<T>, startIndex: number, endIndex?: number, message?: string): void {
    this.__log(`call sort (${iteration}): items: ${items}`);

    this._results.iterations.push({
      endIndex,
      iteration,
      message,
      startIndex,
      array: items,
    });

    let leftSize = 0;
    let rightSize = 0;

    if (items && items.length > 1) {
      leftSize = Math.round(items.length / 2);
      rightSize = items.length - leftSize;

      let left: Array<T> = [];
      let right: Array<T> = [];

      this._copy(items, left, 0, leftSize);
      this._copy(items, right, leftSize, leftSize + rightSize);

      this._sort(iteration + 1, left, 0, leftSize - 1, "left side");
      this._sort(iteration + 1, right, leftSize, leftSize + rightSize - 1, "right side");

      this._merge(iteration, items, left, right);
    }

    this.__log(`sorted (${iteration}): items: ${items}`);
  }
}