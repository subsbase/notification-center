import { BadRequestException, INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';

export class NotificationCenterSocketAdapter extends IoAdapter implements WebSocketAdapter {
  private readonly app: INestApplicationContext;

  constructor(app: INestApplicationContext) {
    super(app);
    this.app = app;
  }

  createIOServer(port: number, options?: any) {
    this.app;
    const ioServer = super.createIOServer(port, options);

    ioServer.use((socket: any, next: any) => {
      const headers = socket.handshake.headers;
      if (!headers['x-realm']) {
        return next(new BadRequestException('x-realm header is required'));
      }
      next();
    });

    return ioServer;
  }

  create(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ): Server {
    const server = super.create(port, options);

    server.use((socket, next) => {
      const headers = socket.handshake.headers;
      if (!headers['x-realm']) {
        next(new BadRequestException('x-realm header is required'));
      }
      next();
    });

    return server;
  }
}
