import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guard/auht.guard';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto, UpdateEpisodeDto } from './dto';

@UseGuards(AuthGuard)
@Controller('programs/:programId/episodes')
export class EpisodesController {
  constructor(private readonly service: EpisodesService) {}

  @Post()
  create(@Param('programId') programId: string, @Body() dto: CreateEpisodeDto) {
    return this.service.create(programId, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEpisodeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { ok: true };
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get()
  async list(@Param('programId') programId: string, @Query() q: any) {
    const { items, total } = await this.service.listByProgram(programId, q.limit, q.offset);
    return { total, items };
  }
}
