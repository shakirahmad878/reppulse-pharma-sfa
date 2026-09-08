import { VisitRecord } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { SyncService } from './sync/syncService';
import { DoctorService } from './doctorService';

export class VisitService {
  public static async getVisits(): Promise<VisitRecord[]> {
    return await StorageService.getItem<VisitRecord[]>(STORAGE_KEYS.VISITS_LOCAL, []);
  }

  public static async createVisit(visit: Omit<VisitRecord, 'id' | 'syncStatus'>): Promise<VisitRecord> {
    const newId = 'vis_' + Date.now().toString() + '_' + Math.random().toString(36).substring(7);
    const newVisit: VisitRecord = {
      ...visit,
      id: newId,
      syncStatus: 'PENDING',
    };

    const visits = await this.getVisits();
    visits.unshift(newVisit);
    await StorageService.setItem(STORAGE_KEYS.VISITS_LOCAL, visits);

    // Update doctor's visit count and today status
    await DoctorService.updateDoctorTodayStatus(visit.doctorId, 'COMPLETED');

    // Queue for background cloud sync
    await SyncService.enqueue('VISIT', newVisit);

    return newVisit;
  }

  public static async recordVisit(visit: Omit<VisitRecord, 'id' | 'syncStatus'>): Promise<VisitRecord> {
    return this.createVisit(visit);
  }
}
