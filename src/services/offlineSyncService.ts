/**
 * Offline-First Synchronization Service
 * Manages local mutation queues for DCRs, POB Orders, RCPA Audits,
 * and handles optimistic sync upon network recovery.
 */

export interface QueuedMutation {
  id: string;
  type: 'DCR' | 'POB_ORDER' | 'RCPA_AUDIT' | 'TOUR_PLAN';
  payload: any;
  timestamp: string;
}

const STORAGE_KEY = 'sefmed_offline_mutations_queue';

export class OfflineSyncService {
  private static listeners: ((count: number) => void)[] = [];

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static getQueue(): QueuedMutation[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static enqueue(type: QueuedMutation['type'], payload: any): void {
    const queue = this.getQueue();
    const item: QueuedMutation = {
      id: `mut_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    queue.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    this.notifyListeners();
    console.log(`[OFFLINE_SYNC] Enqueued mutation: ${type}, Pending queue: ${queue.length}`);
  }

  static flushQueue(): { syncedCount: number; items: QueuedMutation[] } {
    const queue = this.getQueue();
    if (queue.length === 0) return { syncedCount: 0, items: [] };

    localStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();
    console.log(`[OFFLINE_SYNC] Flushed ${queue.length} offline mutations successfully.`);
    return { syncedCount: queue.length, items: queue };
  }

  static clearQueue(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();
  }

  static subscribe(fn: (count: number) => void): () => void {
    this.listeners.push(fn);
    fn(this.getQueue().length);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private static notifyListeners() {
    const count = this.getQueue().length;
    this.listeners.forEach(fn => fn(count));
  }
}
