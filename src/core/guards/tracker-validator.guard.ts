import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TrackerValidatorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();
    let result = true;

    try {
      const buffer = JSON.parse(
        decodeURIComponent(req.body.buffer || '') || '[]'
      );

      req.buffer = buffer.filter(item => !!(item.event && item.tags && item.url && item.ts)) || [];
    } catch (e) {
      result = false;
    }

    if (!result) {
      res.sendStatus(400);
    }

    return result;
  }
}
