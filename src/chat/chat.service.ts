/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OpenAI } from 'openai';

@Injectable()
export class ChatService {
  private openai;
  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
  }

  async askOpenAI(prompt: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return { reply: completion.choices[0].message.content.trim() };
  }

  async askGemini(prompt: string) {
    const resp = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      { contents: [{ parts: [{ text: prompt }] }] },
      { params: { key: this.config.get('GOOGLE_GEMINI_API_KEY') } },
    );
    return { reply: resp.data.candidates[0].content.parts[0].text };
  }
}
