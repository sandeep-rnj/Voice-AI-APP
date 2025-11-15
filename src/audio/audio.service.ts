import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AudioService {
  private client: ElevenLabsClient;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('ELEVENLABS_API_KEY');
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set');
    }
    this.client = new ElevenLabsClient({ apiKey });
  }

  async textToSpeech(text: string): Promise<Buffer> {
    const voiceId = this.config.get<string>('ELEVENLABS_VOICE_ID');
    if (!voiceId) {
      throw new Error('ELEVENLABS_VOICE_ID is not set');
    }
    const stream = await this.client.textToSpeech.convert(voiceId, { text });
    const buffer = await this.streamToBuffer(stream);
    return buffer;
  }

  private async streamToBuffer(
    stream: ReadableStream<Uint8Array>,
  ): Promise<Buffer> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const { value, done: d } = await reader.read();
      if (value) {
        chunks.push(value);
      }
      done = d;
    }

    const length = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combined = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    return Buffer.from(combined.buffer);
  }
}
