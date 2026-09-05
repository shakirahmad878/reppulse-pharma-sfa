import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { StorageService, STORAGE_KEYS } from '../storageService';
import { TelemetryLogPoint } from '../../types';

export const SEFMED_TELEMETRY_TASK_NAME = 'SEFMED_BACKGROUND_15MIN_LOCATION_TASK';

// Register background location task handler
TaskManager.defineTask(SEFMED_TELEMETRY_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('[Telemetry Task] Execution Error:', error.message);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const loc = locations[0];
      const point: TelemetryLogPoint = {
        id: `tel_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        employeeId: 'usr-mr-01',
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracyMeters: loc.coords.accuracy || 0,
        speedKmh: (loc.coords.speed || 0) * 3.6,
        batteryPercentage: 90,
        isMockLocation: loc.mocked || false,
        capturedAt: new Date(loc.timestamp).toISOString(),
        syncStatus: 'PENDING'
      };

      console.log('[Telemetry Task] 15-min background point:', point);

      const queue = await StorageService.getItem<TelemetryLogPoint[]>(STORAGE_KEYS.TELEMETRY_QUEUE, []);
      queue.push(point);
      await StorageService.setItem(STORAGE_KEYS.TELEMETRY_QUEUE, queue);
    }
  }
});

export class BackgroundTelemetryManager {
  public static async isRegistered(): Promise<boolean> {
    try {
      return await TaskManager.isTaskRegisteredAsync(SEFMED_TELEMETRY_TASK_NAME);
    } catch {
      return false;
    }
  }

  public static async startTracking(): Promise<{ success: boolean; message: string }> {
    try {
      const { status: fg } = await Location.requestForegroundPermissionsAsync();
      if (fg !== 'granted') {
        return { success: false, message: 'Foreground location permission required for field tracking.' };
      }

      const { status: bg } = await Location.requestBackgroundPermissionsAsync();
      if (bg !== 'granted') {
        return { success: false, message: 'Background location permission (Allow all the time) is required.' };
      }

      const registered = await this.isRegistered();
      if (!registered) {
        await Location.startLocationUpdatesAsync(SEFMED_TELEMETRY_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 15 * 60 * 1000, // 15-minute interval
          distanceInterval: 50,         // 50m displacement
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'SefMed Active Field Duty',
            notificationBody: 'Recording periodic 15-minute compliance pings.',
            notificationColor: '#0D9488'
          }
        });
      }

      return { success: true, message: '15-Minute Background Telemetry successfully activated.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to start background telemetry.' };
    }
  }

  public static async stopTracking(): Promise<void> {
    try {
      const registered = await this.isRegistered();
      if (registered) {
        await Location.stopLocationUpdatesAsync(SEFMED_TELEMETRY_TASK_NAME);
      }
    } catch (err) {
      console.warn('[Telemetry Task] Failed to stop tracking:', err);
    }
  }
}
