import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from './search/search.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'postgres'),
        port: parseInt(cfg.get('DB_PORT') ?? '5432', 10),
        username: cfg.get('DB_USER', 'media'),
        password: cfg.get('DB_PASS', 'media'),
        database: cfg.get('DB_NAME', 'media'),
        synchronize: false,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: cfg.get('REDIS_HOST', 'redis'),
            port: parseInt(cfg.get('REDIS_PORT') ?? '6379', 10),
          },
          ttl: parseInt(cfg.get('CACHE_TTL_SECONDS') ?? '60', 10),
        }),
      }),
    }),
    SearchModule,
  ],
})
export class AppModule {}
