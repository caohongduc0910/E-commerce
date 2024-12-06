import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(parseInt(process.env.PORT_SK) || 3000, {
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private activeUsers = new Map<string, string>();

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Socket server initialized');
    parseInt(process.env.PORT_SK);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    const isAdmin = client.handshake.query.isAdmin === 'true'; // Phân biệt admin/user

    if (isAdmin) {
      client.join('admins'); // Thêm admin vào room `admins`
      console.log(`Admin connected: ${client.id}`);
    } else if (userId) {
      const userIdStr = Array.isArray(userId) ? userId[0] : userId;
      this.activeUsers.set(userIdStr, client.id);
      console.log(`User ${userId} connected with socket ID: ${client.id}`);
    }

    console.log(this.activeUsers);
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.activeUsers.entries()).find(
      ([_, id]) => id === client.id,
    )?.[0];

    if (userId) {
      this.activeUsers.delete(userId); // Xóa user khỏi Map
      console.log(`User ${userId} disconnected`);
    } else {
      console.log(`Admin disconnected: ${client.id}`);
    }
  }

  sendOrderNotification(creatorUserId: string, event: string, payload: any) {
    this.server.to('admins').emit(event, { ...payload, to: 'admins' });
    console.log(`Notification sent to all admins`);

    console.log(this.activeUsers.get(creatorUserId));

    const creatorSocketId = this.activeUsers.get(creatorUserId);
    if (creatorSocketId) {
      this.server
        .to(creatorSocketId)
        .emit(event, { ...payload, to: 'creator' });
      console.log(`Notification sent to creator user ${creatorUserId}`);
    } else {
      console.log(`Creator user ${creatorUserId} is not connected`);
    }
  }
}
