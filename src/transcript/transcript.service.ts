/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TranscriptService {
  constructor(private config: ConfigService) {}

  async transcribe(buffer: Buffer): Promise<string> {
    const apiKey = this.config.get<string>('DEEPGRAM_API_KEY');
    if (!apiKey) {
      throw new Error('DEEPGRAM_API_KEY is not set in environment variables');
    }
    const response = await axios.post(
      'https://api.deepgram.com/v1/listen',
      buffer,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'audio/wav',
        },
        params: {
          punctuate: true,
        },
      },
    );
    const r = response.data;
    if (
      r &&
      r.results &&
      r.results.channels &&
      r.results.channels[0] &&
      r.results.channels[0].alternatives &&
      r.results.channels[0].alternatives[0] &&
      typeof r.results.channels[0].alternatives[0].transcript === 'string'
    ) {
      return r.results.channels[0].alternatives[0].transcript;
    }
    return '';
  }
}
