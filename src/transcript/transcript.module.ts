import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TranscriptController } from './transcript.controller';
import { TranscriptService } from './transcript.service';

@Module({
  imports: [ConfigModule],
  controllers: [TranscriptController],
  providers: [TranscriptService],
})
export class TranscriptModule {}
