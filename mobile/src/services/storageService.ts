import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  AUTH_SESSION: '@SEFMED_AUTH_SESSION_V1',
  DOCTORS_CACHE: '@SEFMED_DOCTORS_CACHE_V1',
  PRODUCTS_CACHE: '@SEFMED_PRODUCTS_CACHE_V1',
  VISITS_LOCAL: '@SEFMED_VISITS_LOCAL_V1',
  ATTENDANCE_LOCAL: '@SEFMED_ATTENDANCE_LOCAL_V1',
  ORDERS_LOCAL: '@SEFMED_ORDERS_LOCAL_V1',
  OFFLINE_SYNC_QUEUE: '@SEFMED_SYNC_QUEUE_V1',
  TELEMETRY_QUEUE: '@SEFMED_TELEMETRY_QUEUE_V1',
  SETTINGS: '@SEFMED_SETTINGS_V1',
};

export class StorageService {
  public static async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : defaultValue;
    } catch (err) {
      console.warn(`[StorageService] Failed to read key: ${key}`, err);
      return defaultValue;
    }
  }

  public static async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to write key: ${key}`, err);
      return false;
    }
  }

  public static async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to delete key: ${key}`, err);
      return false;
    }
  }

  public static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      console.error('[StorageService] Failed to clear storage', err);
    }
  }
}
