type NotificationType = 'success' | 'error' | 'warning' | 'info';

class NotificationService {
  show(message: string, type: NotificationType = 'info') {
    // Implement your notification logic here
    // This could integrate with a UI library like toast notifications
    console.log(`${type}: ${message}`);
  }
}

export const notificationService = new NotificationService(); 