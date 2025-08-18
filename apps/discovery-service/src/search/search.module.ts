import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodesController } from './episodes/episodes.controller';
import { EpisodesService } from './episodes/episodes.service';
import { TypeormEpisodesSearchRepo } from './episodes/repo.typeorm';
import { EpisodeEntity } from '../entities/episode.entity';
import { ProgramEntity } from '../entities/program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeEntity, ProgramEntity])],
  controllers: [EpisodesController],
  providers: [
    EpisodesService,
    TypeormEpisodesSearchRepo,
  ],
})
export class SearchModule {}
