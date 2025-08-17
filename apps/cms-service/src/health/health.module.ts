import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentManager } from '../entities/content-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentManager])],
  controllers: [HealthController],
})
export class HealthModule {}
