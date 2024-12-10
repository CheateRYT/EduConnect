import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private messages: { roomId: string; sender: string; message: string }[] = [];

  addMessage(roomId: string, sender: string, message: string) {
    this.messages.push({ roomId, sender, message });
  }

  getMessages(roomId: string) {
    return this.messages.filter((msg) => msg.roomId === roomId);
  }
}
