/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OpenAI } from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private geminiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }
  //Open Ai Chat
  async askOpenAI(prompt: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });

      return {
        reply: completion.choices[0]?.message?.content?.trim() ?? '',
      };
    } catch (err) {
      console.error('OpenAI Error:', err);
      throw err;
    }
  }
  //Gemini
  async askGemini(prompt: string) {
    try {
      const resp = await axios.post(
        this.geminiUrl,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          params: {
            key: this.config.get<string>('GOOGLE_GEMINI_API_KEY'),
          },
        },
      );

      const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      return { reply: text };
    } catch (err) {
      console.error('Gemini API Error:', err?.response?.data || err);
      throw err;
    }
  }
}
