import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Program } from '../entities/program.entity';
import { Episode } from '../entities/episode.entity';

import { PROGRAMS_REPO, EPISODES_REPO } from './shared/tokens';
import { ProgramsRepoTypeOrm } from './programs/ repo.typeorm';
import { EpisodesRepoTypeOrm } from './episodes/ repo.typeorm';

import { ProgramsService } from './programs/programs.service';
import { EpisodesService } from './episodes/episodes.service';

import { ProgramsController } from './programs/programs.controller';
import { EpisodesController } from './episodes/episodes.controller';
import { AuthModule } from '../auth/auth.module';
import { ContentManager } from '../entities/content-manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Program, Episode, ContentManager]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretkey',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
  ],
  controllers: [ProgramsController, EpisodesController],
  providers: [
    { provide: PROGRAMS_REPO, useClass: ProgramsRepoTypeOrm },
    { provide: EPISODES_REPO, useClass: EpisodesRepoTypeOrm },
    ProgramsService,
    EpisodesService,
  ],
})
export class ContentModule {}
