import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ContentManager } from './entities/content-manager.entity';
import { Program } from './entities/program.entity';
import { Episode } from './entities/episode.entity';
import { UploadModule } from './upload/upload.module';
import { ContentModule } from './content/content.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [ContentManager, Program, Episode],
        autoLoadEntities: true,
        synchronize: false,      
      }),
    }),
    HealthModule,
    AuthModule,
    ContentModule,
    UploadModule,
  ],
})
export class AppModule {}
