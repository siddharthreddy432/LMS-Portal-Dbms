class StorageFallback {
 private memory = new Map<string, string>();
 
 getItem(key: string): string | null {
 try {
 if (typeof window !== 'undefined' && window.localStorage) {
 const val = window.localStorage.getItem(key);
 if (val !== null) return val;
 }
 } catch (e) {
 // ignore
 }
 return this.memory.get(key) || null;
 }
 
 setItem(key: string, value: string): void {
 this.memory.set(key, value);
 try {
 if (typeof window !== 'undefined' && window.localStorage) {
 window.localStorage.setItem(key, value);
 }
 } catch (e) {
 // ignore
 }
 }
 
 removeItem(key: string): void {
 this.memory.delete(key);
 try {
 if (typeof window !== 'undefined' && window.localStorage) {
 window.localStorage.removeItem(key);
 }
 } catch (e) {
 // ignore
 }
 }

 getCachedJson<T = any>(key: string): T | null {
 const raw = this.getItem(key);
 if (!raw) return null;
 try {
 return JSON.parse(raw) as T;
 } catch {
 return null;
 }
 }

 setCachedJson(key: string, data: any): void {
 try {
 this.setItem(key, JSON.stringify(data));
 } catch (e) {
 // ignore quota errors
 }
 }

 clearUserCaches(): void {
 try {
 if (typeof window !== 'undefined' && window.localStorage) {
 const keysToRemove: string[] = [];
 for (let i = 0; i < window.localStorage.length; i++) {
 const k = window.localStorage.key(i);
 if (k && (k.startsWith('klu_') || k.startsWith('kl_') || k.startsWith('sdashboard_'))) {
 if (k !== 'kl_device_id') {
 keysToRemove.push(k);
 }
 }
 }
 keysToRemove.forEach(k => window.localStorage.removeItem(k));
 }
 } catch (e) {
 // ignore
 }
 // Also clear from memory map
 for (const k of Array.from(this.memory.keys())) {
 if ((k.startsWith('klu_') || k.startsWith('kl_') || k.startsWith('sdashboard_')) && k !== 'kl_device_id') {
 this.memory.delete(k);
 }
 }
 }
}

export const safeStorage = new StorageFallback();
