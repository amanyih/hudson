import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const formattedBody = JSON.stringify(body, null, 2);
    this.logger.log(`\n ${method}: ${originalUrl}, Body: ${formattedBody}`);
    next();
  }
}
