import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('openai')
  async chatOpenAI(@Body('prompt') text: string) {
    return this.chatService.askOpenAI(text);
  }

  @Post('gemini')
  async chatGemini(@Body('prompt') text: string) {
    return this.chatService.askGemini(text);
  }
}
