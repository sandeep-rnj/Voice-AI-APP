import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AudioModule } from './audio/audio.module';
import { ChatModule } from './chat/chat.module';
import { TranscriptModule } from './transcript/transcript.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AudioModule,
    TranscriptModule,
    ChatModule,
  ],
})
export class AppModule {}
