import { SyncQueueItem, SyncEntityType } from '../../types';
import { StorageService, STORAGE_KEYS } from '../storageService';

type SyncListener = (stats: { pending: number; syncing: number; synced: number; failed: number }) => void;

export class SyncService {
  private static isSyncing = false;
  private static listeners: SyncListener[] = [];

  public static async enqueue(entityType: SyncEntityType, payload: any): Promise<string> {
    const queue = await StorageService.getItem<SyncQueueItem[]>(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, []);
    
    // Idempotency: Prevent duplicate pending records for same local ID
    const localId = payload.id || `loc_${Date.now()}`;
    const existingIndex = queue.findIndex(item => item.payload?.id === localId && item.status !== 'SYNCED');

    const queueItem: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      entityType,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3,
      status: 'PENDING'
    };

    if (existingIndex >= 0) {
      queue[existingIndex] = queueItem;
    } else {
      queue.unshift(queueItem);
    }

    await StorageService.setItem(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, queue);
    this.notifyListeners();
    return queueItem.id;
  }

  public static async getQueue(): Promise<SyncQueueItem[]> {
    return await StorageService.getItem<SyncQueueItem[]>(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, []);
  }

  public static async getStats(): Promise<{ pending: number; syncing: number; synced: number; failed: number }> {
    const queue = await this.getQueue();
    return {
      pending: queue.filter(q => q.status === 'PENDING').length,
      syncing: queue.filter(q => q.status === 'SYNCING').length,
      synced: queue.filter(q => q.status === 'SYNCED').length,
      failed: queue.filter(q => q.status === 'FAILED').length
    };
  }

  public static async processQueue(): Promise<{ processedCount: number; failedCount: number }> {
    if (this.isSyncing) return { processedCount: 0, failedCount: 0 };
    this.isSyncing = true;

    const queue = await this.getQueue();
    let processedCount = 0;
    let failedCount = 0;

    for (const item of queue) {
      if (item.status === 'SYNCED') continue;

      item.status = 'SYNCING';
      this.notifyListeners();

      try {
        // Simulate controlled cloud upload
        await new Promise(resolve => setTimeout(resolve, 400));

        // Mark as synced with server ID
        item.status = 'SYNCED';
        item.payload.serverId = `srv_${Date.now()}`;
        item.payload.syncStatus = 'SYNCED';
        processedCount++;
      } catch (err: any) {
        item.retryCount += 1;
        item.lastError = err?.message || 'Network timeout';
        item.status = item.retryCount >= item.maxRetries ? 'FAILED' : 'PENDING';
        failedCount++;
      }
    }

    await StorageService.setItem(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, queue);
    this.isSyncing = false;
    this.notifyListeners();

    return { processedCount, failedCount };
  }

  public static async retryFailed(): Promise<void> {
    const queue = await this.getQueue();
    queue.forEach(item => {
      if (item.status === 'FAILED') {
        item.status = 'PENDING';
        item.retryCount = 0;
      }
    });
    await StorageService.setItem(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, queue);
    await this.processQueue();
  }

  public static subscribe(listener: SyncListener): () => void {
    this.listeners.push(listener);
    this.getStats().then(s => listener(s));
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.getStats().then(stats => {
      this.listeners.forEach(l => l(stats));
    });
  }
}
