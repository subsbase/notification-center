import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { Notification } from "../repositories/subscriber/notification/schema";

@WebSocketGateway({
  cors: true
})
export class EventsGateway {
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('joinGroup')
  joinGroup(@MessageBody() subscriberId: string) {
    this.server.socketsJoin(subscriberId)
  }
    
  notifySubscribers(notification: Notification, subscriberIds: Array<string>) {
    this.server.to(subscriberIds).emit("notification", notification)
  }
}