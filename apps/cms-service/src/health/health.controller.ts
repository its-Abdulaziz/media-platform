import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly ds: DataSource) {}

  @Get()
  async check() {
    try {
      await this.ds.query('SELECT 1');
      return { status: 'ok' };
    } catch (e) {
      throw new HttpException({ status: 'down', error: String(e) }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}