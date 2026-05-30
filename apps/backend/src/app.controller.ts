import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as packageJson from '../package.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('version')
  getVersion(): { version: string; name: string } {
    return {
      version: packageJson.version,
      name: packageJson.name,
    };
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
