export class HashTable<T> {
  private table: Map<string, T>;
  private size: number;
  private collisionCount: number;

  constructor() {
    this.table = new Map<string, T>();
    this.size = 0;
    this.collisionCount = 0;
  }

  // Hash function using djb2 algorithm
  private hash(key: string): number {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) + hash) + key.charCodeAt(i);
    }
    return Math.abs(hash);
  }

  // Insert or update key-value pair
  set(key: string, value: T): void {
    const hashKey = this.hash(key).toString();
    
    if (this.table.has(hashKey) && hashKey !== this.getExistingKey(key)) {
      this.collisionCount++;
    }
    
    this.table.set(hashKey + '_' + key, value);
    this.size++;
  }

  private getExistingKey(key: string): string | null {
    const hashKey = this.hash(key).toString();
    for (const [k] of this.table.entries()) {
      if (k.startsWith(hashKey + '_') && k.endsWith('_' + key)) {
        return k;
      }
    }
    return null;
  }

  // Get value by key
  get(key: string): T | undefined {
    const hashKey = this.hash(key).toString();
    for (const [k, v] of this.table.entries()) {
      if (k.startsWith(hashKey + '_') && k.endsWith('_' + key)) {
        return v;
      }
    }
    return undefined;
  }

  // Check if key exists
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  // Delete by key
  delete(key: string): boolean {
    const hashKey = this.hash(key).toString();
    for (const [k] of this.table.entries()) {
      if (k.startsWith(hashKey + '_') && k.endsWith('_' + key)) {
        this.table.delete(k);
        this.size--;
        return true;
      }
    }
    return false;
  }

  // Get all keys
  keys(): string[] {
    const keys: string[] = [];
    for (const k of this.table.keys()) {
      const parts = k.split('_');
      keys.push(parts[parts.length - 1]);
    }
    return keys;
  }

  // Get all values
  values(): T[] {
    return Array.from(this.table.values());
  }

  // Get all entries
  entries(): [string, T][] {
    const entries: [string, T][] = [];
    for (const [k, v] of this.table.entries()) {
      const parts = k.split('_');
      entries.push([parts[parts.length - 1], v]);
    }
    return entries;
  }

  // Get size
  getSize(): number {
    return this.size;
  }

  // Check if empty
  isEmpty(): boolean {
    return this.size === 0;
  }

  // Clear the table
  clear(): void {
    this.table.clear();
    this.size = 0;
    this.collisionCount = 0;
  }

  // Get collision count
  getCollisionCount(): number {
    return this.collisionCount;
  }

  // Get load factor
  getLoadFactor(): number {
    return this.size / this.table.size;
  }

  // Filter values based on predicate
  filter(predicate: (value: T) => boolean): T[] {
    const result: T[] = [];
    for (const value of this.table.values()) {
      if (predicate(value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Map values
  map<U>(transform: (value: T) => U): U[] {
    const result: U[] = [];
    for (const value of this.table.values()) {
      result.push(transform(value));
    }
    return result;
  }

  // Find first matching value
  find(predicate: (value: T) => boolean): T | undefined {
    for (const value of this.table.values()) {
      if (predicate(value)) {
        return value;
      }
    }
    return undefined;
  }

  // Get internal bucket structure for visualization
  getBuckets(): { hash: number; keys: string[] }[] {
    const buckets = new Map<number, string[]>();
    
    for (const k of this.table.keys()) {
      const parts = k.split('_');
      const hashKey = parseInt(parts[0]);
      const originalKey = parts[parts.length - 1];
      
      if (!buckets.has(hashKey)) {
        buckets.set(hashKey, []);
      }
      buckets.get(hashKey)!.push(originalKey);
    }
    
    return Array.from(buckets.entries())
      .map(([hash, keys]) => ({ hash, keys }))
      .sort((a, b) => a.hash - b.hash);
  }

  // Get statistics
  getStats(): {
    size: number;
    uniqueHashes: number;
    collisions: number;
    loadFactor: number;
    averageBucketSize: number;
  } {
    const buckets = this.getBuckets();
    const uniqueHashes = buckets.length;
    const totalItems = buckets.reduce((sum, b) => sum + b.keys.length, 0);
    
    return {
      size: this.size,
      uniqueHashes,
      collisions: this.collisionCount,
      loadFactor: this.getLoadFactor(),
      averageBucketSize: uniqueHashes > 0 ? totalItems / uniqueHashes : 0
    };
  }
}
