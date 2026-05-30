import {
  Injectable,
  Inject,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(@Inject(PinoLogger) private readonly logger: PinoLogger) {}

  log(message: string, context?: string, data?: Record<string, unknown>) {
    this.logger.log({ context, ...data }, message);
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    data?: Record<string, unknown>,
  ) {
    this.logger.error({ context, trace, ...data }, message);
  }

  warn(message: string, context?: string, data?: Record<string, unknown>) {
    this.logger.warn({ context, ...data }, message);
  }

  debug(message: string, context?: string, data?: Record<string, unknown>) {
    this.logger.debug({ context, ...data }, message);
  }

  verbose(message: string, context?: string, data?: Record<string, unknown>) {
    this.logger.log({ context, level: 'verbose', ...data }, message);
  }
}
