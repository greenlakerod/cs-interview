import { LinkedList, LinkedListNode } from ".";

export default class DoublyLinkedList<T> extends LinkedList<T> {
  public addNode(node: LinkedListNode<T>, index?: number): boolean {
    if (!node) return false;
    if (index === undefined || index <= 0) {
      if (this._head) {
        node.next = this._head;
        this._head.prev = node;
      }
      this._head = node;

      if (this._tail === null) {
        this._tail = this._head;
      }

      this._count++;
      return true;
    } else if (index >= this._count) {
      if (this._head === null) {
        this._head = node;
      }
      if (this._tail) {
        this._tail.next = node;
        node.prev = this._tail;
      }
      this._tail = node;
      this._count++;

      return true;
    } else {
      let current: LinkedListNode<T> | null | undefined;
      let i: number;

      if (index > this._count / 2) {
        current = this._tail;
        i = this._count - 1;

        while (current && --i > index) {
          current = current.prev;
        }

        if (current) {
          node.prev = current.prev;
          node.next = current;

          if (current.prev) {
            current.prev.next = node;
          }
          current.prev = node;

          this._count++;

          return true;
        }
      } else {
        current = this._head;
        i = 0;

        while (current && ++i < index) {
          current = current.next;
        }

        if (current) {
          node.next = current.next;
          node.prev = current;

          if (current.next) {
            current.next.prev = node;
          }
          current.next = node;

          this._count++;

          return true;
        }
      }
    }

    return false;
  }
  
  public addFirst(value: T): boolean {
    return this.addNode(new LinkedListNode<T>(value), 0);
  }

  public addLast(value: T): boolean {
    return this.addNode(new LinkedListNode<T>(value), this._count);
  }

  public add(value: T, index?: number): boolean {
    if (this._head === null || index === undefined || index <= 0) {
      return this.addFirst(value);
    } else if (index >= this._count) {
      return this.addLast(value);
    }

    return this.addNode(new LinkedListNode<T>(value), index);
  }

  public removeFirst(): boolean {
    if (!this._head || this._count === 0) return false;
    if (this._count === 1) return this.clear();

    if (this._head.next) {
      this._head = this._head.next;
      this._head.prev = null;
    } else {
      this._head = null;
    }

    this._count--;
    if (this._count === 1) {
      this._tail = this._head;
    }
    return true;
  }

  public removeLast(): boolean {
    if (!this._head || !this._tail || this._count === 0) return false;
    if (this._count === 1) return this.clear();

    this._tail = this._tail.prev;
    if (this._tail) {
      this._tail.next = null;
    }

    this._count--;
    if (this._count === 1) {
      this._head = this._tail;
    }

    return true;
  }

  public remove(index: number): boolean {
    if (index === undefined || index < 0 || index >= this._count) {
      throw "Invalid index";
    }
    if (!this._head || this._count === 0) return false;
    if (index === 0) return this.removeFirst();
    if (index === this._count - 1) return this.removeLast();

    let current: LinkedListNode<T> | null | undefined;
    let i: number;

    if (index > this._count / 2) {
      current = this._tail;
      i = this._count - 1;

      while (current && --i > index) {
        current = current.prev;
      }
      if (current && current.prev) {
        current.prev = current.prev.prev;

        if (current.prev) {
          current.prev.next = current;
        }
        this._count--;

        return true;
      }
    } else {
      current = this._head;
      i = 0;

      while (current && ++i < index) {
        current = current.next;
      }

      if (current && current.next) {
        current.next = current.next.next;

        if (current.next) {
          current.next.prev = current;
        }
        this._count--;

        return true;
      }
    }

    return false;
  }

  public removeNode(node: LinkedListNode<T>): boolean {
    if (!node) return false;
    if (!this._head || !this._tail || !this._count) return false;

    if (this._head === node) {
      this._head = this._head.next;
      if (this._head) {
        this._head.prev = null;
      }
    } else if (this._tail === node) {
      this._tail = this._tail.prev;
      if (this._tail) {
        this._tail.next = null;
      }
    } else {
      const prev = node.prev;
      const next = node.next;

      if (prev) {
        prev.next = next;
      }
      if (next) {
        next.prev = prev;
      }
    }

    this._count--;

    if (this._count === 1) {
      this._tail = this._head;
    } else if (this._count === 0) {
      this.clear();
    }

    return true;
  }

  public reverse(
    // node: LinkedListNode<T> | null | undefined = this._head
  ): LinkedListNode<T> | null | undefined {
    if (this._count <= 1 || !this._head || !this._tail) return null;

    // If the list is empty or has only one node,
    // return the head as is
    // if (this._head === null || this._head.next === null)
    //   return this._head;

    let prev: LinkedListNode<T> | null | undefined = null;
    let current: LinkedListNode<T> | null | undefined = this._head;

    // Traverse the list and reverse the links
    while (current) {
      // Swap the next and prev pointers
      prev = current.prev;
      current.prev = current.next;
      current.next = prev;

      if (current.next === null) {
        this._tail = current;
      }

      // Move to the next node in the original list 
      // (which is now previous due to reversal)
      current = current.prev;
    }

    // return prev.prev;
    this._head = prev?.prev;
    return this._head;

    // let current: LinkedListNode<T> | null | undefined = this._head; // = node;
    // let next: LinkedListNode<T> | null | undefined = null;
    // let prev: LinkedListNode<T> | null | undefined = null;

    // while (current) {
    //   next = current.next;
    //   current.next = prev;
    //   prev = current;

    //   if (current.next === null) {
    //     this._tail = current;
    //   }

    //   current = next;
    // }

    // this._head = prev;
    // return this._head;

    // // // Base case: if the list is empty 
    // // // or we reach the end of the list
    // // if (!node || node === null) {
    // //   return null;
    // // }

    // // // Swap the next and prev pointers
    // // const temp = node.prev;
    // // node.prev = node.next;
    // // node.next = temp;

    // // // If the previous node (after swap) is null,
    // // // this is the new head
    // // if (!node.prev || node.prev === null) {
    // //   return node;
    // // }

    // // return this.reverse(node.prev);
  }
}