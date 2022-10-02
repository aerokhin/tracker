import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BackService {
  constructor(private configService: ConfigService) {
  }

  async simulateLongCall() {
    const longCall = this.configService.get<number>('api.longCall');

    if (longCall > 0) {
      const processCall = () => new Promise(resolve => {
        setTimeout(() => { resolve(null); }, longCall);
      });
      await processCall();
    }

    return true;
  }
}
