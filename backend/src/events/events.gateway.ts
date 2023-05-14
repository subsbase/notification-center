import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Notification } from '../repositories/subscriber/notification/schema';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Socket } from 'socket.io'

@WebSocketGateway({
  cors: true
})
export class EventsGateway implements OnGatewayConnection{
  constructor(private readonly eventEmitter: EventEmitter2) {}
  private socket: Socket;

  handleConnection(socket: Socket, ...args: any[]) {
    this.socket = socket;
  }

  protected get Realm () : string {
    return this.socket.handshake?.headers['x-realm'] as string;
  }

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('joinGroup')
  joinGroup(@MessageBody() subscriberId: string) {
    this.server.socketsJoin(subscriberId);
    this.eventEmitter.emit('subscriber.joined', this.Realm, subscriberId);
  }

  notifySubscribers(notification: Notification, subscriberIds: Array<string>) {
    this.server.to(subscriberIds).emit('notification', notification);
  }

  @OnEvent('notification.*')
  handleNotificationEvent(payload: any) {
    this.server.to(payload.subscriberId).emit(payload.constructor.name, payload.notificationsIds);
  }

  @OnEvent('notifications.*')
  handleNotificationsEvent(payload: any) {
    this.server.to(payload.subscriberId).emit(payload.constructor.name.toString());
  }
}
