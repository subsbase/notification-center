import { Subscriber } from '../../repositories/subscriber/schema';
import { ArchivedNotification } from '../../repositories/archived-notifications/schema';

export class ArchivedNotificationProcessor {
  buildFromSubscriber(subscriber: Subscriber): Array<ArchivedNotification> {
    return (
      subscriber.archivedNotifications?.map((notificationToArchive) => {
        let notification: ArchivedNotification = new ArchivedNotification();
        notification.actionUrl = notificationToArchive.actionUrl;
        notification.archivedAt = notificationToArchive.archivedAt;
        notification.message = notificationToArchive.message;
        notification.createdAt = notificationToArchive.createdAt;
        notification.updatedAt = notificationToArchive.updatedAt;
        notification.id = notificationToArchive.id;
        notification.read = notificationToArchive.read;
        notification.subject = notificationToArchive.subject;
        notification.realm = subscriber.realm;
        notification.subscriber = subscriber;

        return notification;
      }) || []
    );
  }
}
