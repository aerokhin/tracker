import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as http from 'http';
import { FrontModule } from './front/front.module';
import { BackModule } from './back/back.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontServer = express();
  const frontApp = await NestFactory.create<NestExpressApplication>(
    FrontModule,
    new ExpressAdapter(frontServer),
  );
  await frontApp.init();
  frontApp.useStaticAssets(join(__dirname, 'assets', 'public'));

  http
    .createServer(frontServer)
    .listen(configService.get<number>('http.port.front'));

  const backServer = express();
  const backApp = await NestFactory.create<NestExpressApplication>(
    BackModule,
    new ExpressAdapter(backServer),
    { cors: { origin: 'http://localhost:8000', methods: ['GET', 'POST'] } },
  );
  await backApp.init();

  http
    .createServer(backServer)
    .listen(configService.get<number>('http.port.back'));
}

bootstrap();
