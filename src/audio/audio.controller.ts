import { Body, Controller, Post, Res, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('tts')
  async tts(@Body('text') text: string, @Res() res: Response) {
    if (!text || typeof text !== 'string') {
      throw new BadRequestException('Field "text" is required and must be a string.');
    }

    const audio = await this.audioService.textToSpeech(text);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="speech.mp3"',
    });

    res.send(audio);
  }
}
