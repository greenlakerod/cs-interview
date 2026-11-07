import { Sorter   } from ".";

export class QuickSort<T> extends Sorter<T> {
  public sort(items: Array<T>): void {
    if (items && items.length > 1) {
      this._sort(1, items, 0, items.length - 1, "original array");
    } else {
      this.__log(`no sort needed on items: ${items ?? "undefined"}`);
    }
  }

  private _setPivot(start: number, end: number): number {
    return (Math.round((start + end) / 2)); //return return Math.floor((Math.random() * end) + start);
  }

  private _sort(iteration: number, items: Array<T>, startIndex: number, endIndex: number, message: string): void {
    this.__log(`call sort (${iteration}): items: ${items}`);

    this._results.iterations.push({
      endIndex,
      iteration,
      message,
      startIndex,
      array: [...items],
    });

    if (startIndex < endIndex) {
      //let the pivot be the value in the middle of the range
      //it may not be the actual middle value
      let currentPivotIndex = this._setPivot(startIndex, endIndex);

      //put the pivot value in the first index so it's not in the
      //"sorting" range
      this._swap(items, startIndex, currentPivotIndex);
      this._results.swaps++;

      //the sorting range starts immediately after the index where the pivot
      //value is located
      let key = items[startIndex];
      let i = startIndex + 1;
      let j = endIndex;

      while (i <= j) {
        //disregard any values less than or equal to the pivot.
        //they need to stay to the left
        while ((i <= endIndex) && (items[i] <= key)) {
          this._results.comparisons++;
          i++;
        }

        //disregard any values greater than the pivot
        //they need to stay to the right
        while ((j >= startIndex) && (items[j] > key)) {
          this._results.comparisons++;
          j--;
        }

        //only swap if the start/end points overlap
        if (i < j) {
          this._swap(items, i, j);
          this._results.swaps++;
        }        
      }

      //move the pivot value back to the "center"
      this._swap(items, startIndex, j);
      this._results.swaps++;

      //divide the array into two then repeat
      this._sort(iteration + 1, items, startIndex, j - 1, `left side (start: ${startIndex}, end: ${j - 1}, pivot: ${currentPivotIndex})`);
      this._sort(iteration + 1, items, j + 1, endIndex, `right side (start: ${j + 1}, end: ${endIndex}, pivot: ${currentPivotIndex})`);

      this.__log(`sorted (${iteration}): pivot index: ${currentPivotIndex}, items: ${items}`);
    } else {
      this.__log(`sorted (${iteration}): items: ${items}`);
    }
  }
}