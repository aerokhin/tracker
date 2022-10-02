import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FrontModule } from './front/front.module';
import { BackModule } from './back/back.module';
import { TrackModule } from './track/track.module';
import config from './core/loaders/config.loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      cache: true,
    }),
    FrontModule,
    BackModule,
    TrackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
