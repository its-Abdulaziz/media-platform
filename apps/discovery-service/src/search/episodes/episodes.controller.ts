import { Controller, Get, Query } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodeSearchQueryDto } from './dto';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly service: EpisodesService) {}

  @Get()
  search(@Query() q: EpisodeSearchQueryDto) {
    return this.service.search(q.q, q.page, q.size);
  }
}
