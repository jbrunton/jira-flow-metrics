import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("Incoming request");

  use(req, _res: Response, next: NextFunction) {
    this.logger.log(`${req.method} ${req.originalUrl}`);

    if (next) {
      next();
    }
  }
}
