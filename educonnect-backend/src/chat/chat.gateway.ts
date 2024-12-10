import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  afterInit() {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId); // Пользователь присоединяется к комнате
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; sender: string; message: string },
  ) {
    this.chatService.addMessage(data.roomId, data.sender, data.message);
    this.server.to(data.roomId).emit('newMessage', data); // Отправляем сообщение только участникам комнаты
  }

  @SubscribeMessage('getMessages')
  handleGetMessages(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = this.chatService.getMessages(data.roomId);
    client.emit('messages', messages); // Отправляем клиенту все сообщения из комнаты
  }
}
