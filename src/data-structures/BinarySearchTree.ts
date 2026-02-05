import type { TreeNode } from '@/types';

export class BinarySearchTree<T> {
  private root: TreeNode<T> | null = null;
  private size: number = 0;
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  // Get height of a node
  private getNodeHeight(node: TreeNode<T> | null): number {
    return node ? node.height : 0;
  }

  // Get balance factor
  private getBalanceFactor(node: TreeNode<T> | null): number {
    return node ? this.getNodeHeight(node.left) - this.getNodeHeight(node.right) : 0;
  }

  // Update height
  private updateHeight(node: TreeNode<T>): void {
    node.height = 1 + Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right));
  }

  // Right rotation
  private rotateRight(y: TreeNode<T>): TreeNode<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  // Left rotation
  private rotateLeft(x: TreeNode<T>): TreeNode<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  // Insert a value
  insert(data: T): void {
    this.root = this.insertNode(this.root, data);
    this.size++;
  }

  private insertNode(node: TreeNode<T> | null, data: T): TreeNode<T> {
    // Standard BST insertion
    if (!node) {
      return { data, left: null, right: null, height: 1 };
    }

    const cmp = this.compare(data, node.data);
    
    if (cmp < 0) {
      node.left = this.insertNode(node.left, data);
    } else if (cmp > 0) {
      node.right = this.insertNode(node.right, data);
    } else {
      // Duplicate values not allowed
      this.size--; // Compensate for the increment
      return node;
    }

    // Update height
    this.updateHeight(node);

    // Get balance factor
    const balance = this.getBalanceFactor(node);

    // Left Left Case
    if (balance > 1 && this.compare(data, node.left!.data) < 0) {
      return this.rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && this.compare(data, node.right!.data) > 0) {
      return this.rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && this.compare(data, node.left!.data) > 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && this.compare(data, node.right!.data) < 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  // Find minimum value node
  private findMin(node: TreeNode<T>): TreeNode<T> {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  // Delete a value
  delete(data: T): boolean {
    const initialSize = this.size;
    this.root = this.deleteNode(this.root, data);
    return this.size < initialSize;
  }

  private deleteNode(node: TreeNode<T> | null, data: T): TreeNode<T> | null {
    if (!node) return null;

    const cmp = this.compare(data, node.data);

    if (cmp < 0) {
      node.left = this.deleteNode(node.left, data);
    } else if (cmp > 0) {
      node.right = this.deleteNode(node.right, data);
    } else {
      // Node found
      this.size--;

      // Node with only one child or no child
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      }

      // Node with two children
      const minNode = this.findMin(node.right);
      node.data = minNode.data;
      node.right = this.deleteNode(node.right, minNode.data);
    }

    // Update height
    this.updateHeight(node);

    // Get balance factor
    const balance = this.getBalanceFactor(node);

    // Left Left Case
    if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
      return this.rotateRight(node);
    }

    // Left Right Case
    if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    // Right Left Case
    if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  // Search for a value
  search(data: T): T | null {
    return this.searchNode(this.root, data);
  }

  private searchNode(node: TreeNode<T> | null, data: T): T | null {
    if (!node) return null;

    const cmp = this.compare(data, node.data);
    
    if (cmp === 0) {
      return node.data;
    } else if (cmp < 0) {
      return this.searchNode(node.left, data);
    } else {
      return this.searchNode(node.right, data);
    }
  }

  // Find element matching predicate
  find(predicate: (data: T) => boolean): T | null {
    return this.findNode(this.root, predicate);
  }

  private findNode(node: TreeNode<T> | null, predicate: (data: T) => boolean): T | null {
    if (!node) return null;

    if (predicate(node.data)) {
      return node.data;
    }

    const leftResult = this.findNode(node.left, predicate);
    if (leftResult) return leftResult;

    return this.findNode(node.right, predicate);
  }

  // In-order traversal
  inOrder(): T[] {
    const result: T[] = [];
    this.inOrderTraversal(this.root, result);
    return result;
  }

  private inOrderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      this.inOrderTraversal(node.left, result);
      result.push(node.data);
      this.inOrderTraversal(node.right, result);
    }
  }

  // Pre-order traversal
  preOrder(): T[] {
    const result: T[] = [];
    this.preOrderTraversal(this.root, result);
    return result;
  }

  private preOrderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      result.push(node.data);
      this.preOrderTraversal(node.left, result);
      this.preOrderTraversal(node.right, result);
    }
  }

  // Post-order traversal
  postOrder(): T[] {
    const result: T[] = [];
    this.postOrderTraversal(this.root, result);
    return result;
  }

  private postOrderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      this.postOrderTraversal(node.left, result);
      this.postOrderTraversal(node.right, result);
      result.push(node.data);
    }
  }

  // Get all elements in range
  rangeSearch(min: T, max: T): T[] {
    const result: T[] = [];
    this.rangeSearchNode(this.root, min, max, result);
    return result;
  }

  private rangeSearchNode(node: TreeNode<T> | null, min: T, max: T, result: T[]): void {
    if (!node) return;

    if (this.compare(min, node.data) <= 0) {
      this.rangeSearchNode(node.left, min, max, result);
    }

    if (this.compare(min, node.data) <= 0 && this.compare(node.data, max) <= 0) {
      result.push(node.data);
    }

    if (this.compare(node.data, max) <= 0) {
      this.rangeSearchNode(node.right, min, max, result);
    }
  }

  // Get k largest elements
  getKLargest(k: number): T[] {
    const result: T[] = [];
    this.reverseInOrder(this.root, k, result);
    return result;
  }

  private reverseInOrder(node: TreeNode<T> | null, k: number, result: T[]): void {
    if (!node || result.length >= k) return;

    this.reverseInOrder(node.right, k, result);
    
    if (result.length < k) {
      result.push(node.data);
      this.reverseInOrder(node.left, k, result);
    }
  }

  // Get tree height
  getHeight(): number {
    return this.getNodeHeight(this.root);
  }

  // Get size
  getSize(): number {
    return this.size;
  }

  // Check if empty
  isEmpty(): boolean {
    return this.size === 0;
  }

  // Clear the tree
  clear(): void {
    this.root = null;
    this.size = 0;
  }

  // Get root
  getRoot(): TreeNode<T> | null {
    return this.root;
  }

  // Get tree structure for visualization
  getTreeStructure(): unknown {
    return this.nodeToObject(this.root);
  }

  private nodeToObject(node: TreeNode<T> | null): unknown {
    if (!node) return null;
    
    return {
      data: node.data,
      height: node.height,
      left: this.nodeToObject(node.left),
      right: this.nodeToObject(node.right)
    };
  }

  // Get statistics
  getStats(): {
    size: number;
    height: number;
    isBalanced: boolean;
  } {
    return {
      size: this.size,
      height: this.getHeight(),
      isBalanced: Math.abs(this.getBalanceFactor(this.root)) <= 1
    };
  }
}
