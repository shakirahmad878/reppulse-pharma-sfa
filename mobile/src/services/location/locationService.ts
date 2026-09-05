import * as Location from 'expo-location';

export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  speedKmh: number;
  isMockLocation: boolean;
  timestamp: string;
}

export class LocationService {
  /**
   * Requests foreground location permission from Android OS.
   */
  public static async requestForegroundPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn('[LocationService] Permission request failed:', err);
      return false;
    }
  }

  /**
   * Gets single high-accuracy GPS fix with timeout and accuracy validation.
   */
  public static async getCurrentLocation(): Promise<LocationResult | null> {
    try {
      const hasPermission = await this.requestForegroundPermission();
      if (!hasPermission) return null;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracyMeters: loc.coords.accuracy || 10,
        speedKmh: (loc.coords.speed || 0) * 3.6,
        isMockLocation: loc.mocked || false,
        timestamp: new Date(loc.timestamp).toISOString()
      };
    } catch (err) {
      console.error('[LocationService] Failed to acquire current GPS fix:', err);
      return null;
    }
  }
}
