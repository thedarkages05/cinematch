import type { LinkedListNode } from '@/types';

export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private size: number = 0;

  // Insert at the end of the list
  append(data: T): void {
    const newNode: LinkedListNode<T> = { data, next: null };
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  // Insert at the beginning of the list
  prepend(data: T): void {
    const newNode: LinkedListNode<T> = { data, next: this.head };
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
    this.size++;
  }

  // Insert at specific index
  insertAt(index: number, data: T): boolean {
    if (index < 0 || index > this.size) return false;
    
    if (index === 0) {
      this.prepend(data);
      return true;
    }
    
    if (index === this.size) {
      this.append(data);
      return true;
    }

    const newNode: LinkedListNode<T> = { data, next: null };
    let current = this.head;
    
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }
    
    newNode.next = current!.next;
    current!.next = newNode;
    this.size++;
    return true;
  }

  // Delete by value (using comparator function)
  delete(predicate: (data: T) => boolean): boolean {
    if (!this.head) return false;

    if (predicate(this.head.data)) {
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.size--;
      return true;
    }

    let current = this.head;
    while (current.next && !predicate(current.next.data)) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      if (!current.next) this.tail = current;
      this.size--;
      return true;
    }

    return false;
  }

  // Find element
  find(predicate: (data: T) => boolean): T | null {
    let current = this.head;
    while (current) {
      if (predicate(current.data)) {
        return current.data;
      }
      current = current.next;
    }
    return null;
  }

  // Get all elements as array
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // Get size
  getSize(): number {
    return this.size;
  }

  // Check if empty
  isEmpty(): boolean {
    return this.size === 0;
  }

  // Clear the list
  clear(): void {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Get head
  getHead(): LinkedListNode<T> | null {
    return this.head;
  }

  // Filter elements and return new linked list
  filter(predicate: (data: T) => boolean): LinkedList<T> {
    const result = new LinkedList<T>();
    let current = this.head;
    while (current) {
      if (predicate(current.data)) {
        result.append(current.data);
      }
      current = current.next;
    }
    return result;
  }

  // Map elements to new linked list
  map<U>(transform: (data: T) => U): LinkedList<U> {
    const result = new LinkedList<U>();
    let current = this.head;
    while (current) {
      result.append(transform(current.data));
      current = current.next;
    }
    return result;
  }

  // Sort the linked list (using merge sort)
  sort(compare: (a: T, b: T) => number): void {
    this.head = this.mergeSort(this.head, compare);
    
    // Update tail
    let current = this.head;
    while (current && current.next) {
      current = current.next;
    }
    this.tail = current;
  }

  private mergeSort(head: LinkedListNode<T> | null, compare: (a: T, b: T) => number): LinkedListNode<T> | null {
    if (!head || !head.next) return head;

    const middle = this.getMiddle(head);
    const nextToMiddle = middle.next;
    middle.next = null;

    const left = this.mergeSort(head, compare);
    const right = this.mergeSort(nextToMiddle, compare);

    return this.sortedMerge(left, right, compare);
  }

  private getMiddle(head: LinkedListNode<T>): LinkedListNode<T> {
    let slow = head;
    let fast = head;
    
    while (fast.next && fast.next.next) {
      slow = slow.next!;
      fast = fast.next.next;
    }
    
    return slow;
  }

  private sortedMerge(a: LinkedListNode<T> | null, b: LinkedListNode<T> | null, compare: (a: T, b: T) => number): LinkedListNode<T> | null {
    if (!a) return b;
    if (!b) return a;

    let result: LinkedListNode<T>;
    
    if (compare(a.data, b.data) <= 0) {
      result = a;
      result.next = this.sortedMerge(a.next, b, compare);
    } else {
      result = b;
      result.next = this.sortedMerge(a, b.next, compare);
    }
    
    return result;
  }
}
