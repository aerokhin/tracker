import { Module } from '@nestjs/common';
import { BackController } from './controllers/back.controller';
import { BackService } from './services/back.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackModule } from '../track/track.module';
import config from '../core/loaders/config.loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      cache: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/tracker'),
    TrackModule,
  ],
  controllers: [BackController],
  providers: [BackService],
})
export class BackModule {}
