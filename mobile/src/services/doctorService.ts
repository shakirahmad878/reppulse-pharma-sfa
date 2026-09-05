import { Doctor } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { DOCTORS_MOCK } from '../constants/mockData';

export class DoctorService {
  public static async getDoctors(): Promise<Doctor[]> {
    const cached = await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    if (cached && cached.length > 0) return cached;
    
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, DOCTORS_MOCK);
    return DOCTORS_MOCK;
  }

  public static async getDoctorById(id: string): Promise<Doctor | null> {
    const doctors = await this.getDoctors();
    return doctors.find(d => d.id === id) || null;
  }

  public static async updateDoctorTodayStatus(id: string, status: Doctor['todayVisitStatus']): Promise<void> {
    const doctors = await this.getDoctors();
    const doc = doctors.find(d => d.id === id);
    if (doc) {
      doc.todayVisitStatus = status;
      if (status === 'COMPLETED') {
        doc.completedVisitsThisMonth += 1;
        doc.lastVisitDate = new Date().toISOString().split('T')[0];
      }
      await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, doctors);
    }
  }
}
