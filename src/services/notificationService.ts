/**
 * SefMed Push Notification Service
 * Handles FCM / Expo Push Tokens, local alerts, and foreground in-app toasts.
 */

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: 'TOUR_PLAN' | 'DCR' | 'TELEMETRY' | 'EXPENSE' | 'ANNOUNCEMENT';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

class NotificationService {
  private notifications: AppNotification[] = [
    {
      id: 'notif-1',
      title: 'Tour Plan Approved',
      body: 'Your Monthly Tour Plan for Bandra West territory has been approved by ASM Sunil Gavaskar.',
      category: 'TOUR_PLAN',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'Geofence Verification Passed',
      body: 'Dr. Alok Verma visit was verified inside the 100m clinic radius (Distance: 15.3m).',
      category: 'DCR',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: true
    },
    {
      id: 'notif-3',
      title: 'New Product Scheme Active',
      body: '10+1 Scheme active on CardioSafe-AM strips until month-end.',
      category: 'ANNOUNCEMENT',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isRead: true
    }
  ];

  private listeners: ((notifications: AppNotification[]) => void)[] = [];

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  public markAsRead(id: string): void {
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      this.notifyListeners();
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach(n => (n.isRead = true));
    this.notifyListeners();
  }

  public pushNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): AppNotification {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notification
    };
    this.notifications.unshift(newNotif);
    this.notifyListeners();
    return newNotif;
  }

  public subscribe(callback: (notifications: AppNotification[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getNotifications());
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(cb => cb(this.getNotifications()));
  }
}

export const notificationService = new NotificationService();