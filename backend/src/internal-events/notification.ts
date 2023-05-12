export class NotificationEvent {
  constructor(subscriberId: string, notificationsIds: Array<string>) {
    this.subscriberId = subscriberId;
    this.notificationsIds = notificationsIds;
  }

  subscriberId: string;
  notificationsIds: Array<string>;
}

export class NotificationArchived extends NotificationEvent {
  constructor(subscriberId: string, notificationsIds: Array<string>) {
    super(subscriberId, notificationsIds);
  }
}

export class NotificationUnarchived extends NotificationEvent {
  constructor(subscriberId: string, notificationsIds: Array<string>) {
    super(subscriberId, notificationsIds);
  }
}

export class NotificationRead extends NotificationEvent {
  constructor(subscriberId: string, notificationsIds: Array<string>) {
    super(subscriberId, notificationsIds);
  }
}

export class NotificationUnread extends NotificationEvent {
  constructor(subscriberId: string, notificationsIds: Array<string>) {
    super(subscriberId, notificationsIds);
  }
}

export class NotificationsEvent {
  constructor(subscriberId: string) {
    this.subscriberId = subscriberId;
  }

  subscriberId: string;
}

export class NotificationsRead extends NotificationsEvent {
  constructor(subscriberId: string) {
    super(subscriberId);
  }
}

export class NotificationsUnread extends NotificationsEvent {
  constructor(subscriberId: string) {
    super(subscriberId);
  }
}
