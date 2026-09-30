export class GlobalCache {
 private static instance: GlobalCache;
 private cache = new Map<string, { data: any, timestamp: number }>();
 private TTL = 1000 * 60 * 60; // 1 hour

 private constructor() {}

 static getInstance(): GlobalCache {
 if (!GlobalCache.instance) {
 GlobalCache.instance = new GlobalCache();
 }
 return GlobalCache.instance;
 }

 set(key: string, data: any) {
 this.cache.set(key, { data, timestamp: Date.now() });
 }

 get(key: string): any | null {
 const entry = this.cache.get(key);
 if (!entry) return null;
 if (Date.now() - entry.timestamp > this.TTL) {
 this.cache.delete(key);
 return null;
 }
 return entry.data;
 }

 has(key: string): boolean {
 return this.get(key) !== null;
 }

 delete(key: string) {
 this.cache.delete(key);
 }
}
