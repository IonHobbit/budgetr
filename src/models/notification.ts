export interface INotification {
  id: string;
  subject: string;
  message: string;
  url?: string;
  read: boolean;
}

export class Notification implements INotification {
  public id: string;
  public subject: string;
  public message: string;
  public url?: string;
  public read: boolean

  constructor(notification: Notification) {
    this.id = notification.id;
    this.url = notification.url;
    this.subject = notification.subject;
    this.message = notification.message;
    this.read = notification.read || false;
  }
}