import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guard/auht.guard';
import { ProgramsService } from './programs.service';
import { CreateProgramDto, UpdateProgramDto } from './dto';

@UseGuards(AuthGuard)
@Controller('programs')
export class ProgramsController {
  constructor(private readonly service: ProgramsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateProgramDto) {
    const cmId = req.user?.sub ?? null;
    return this.service.create(cmId, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
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
  async list(@Query() q: any) {
    const { items, total } = await this.service.list(q.limit, q.offset);
    return { total, items };
  }
}
