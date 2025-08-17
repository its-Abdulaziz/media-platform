import { Inject, Injectable } from '@nestjs/common';
import { PROGRAMS_REPO } from '../shared/tokens';
import { Program } from '../../entities/program.entity';
import { ProgramsRepoTypeOrm } from './ repo.typeorm';

@Injectable()
export class ProgramsService {
  constructor(@Inject(PROGRAMS_REPO) private readonly repo: ProgramsRepoTypeOrm) {}

  create(cmId: string|null, dto: { title: string; type?: Program['type']; status?: Program['status'] }) {
    return this.repo.create({
      title: dto.title,
      type: dto.type ?? 'podcast',
      status: dto.status ?? 'draft',
      content_manager_id: cmId,
    });
  }

  update(id: string, dto: Partial<Pick<Program,'title'|'type'|'status'>>) {
    return this.repo.update(id, dto);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }

  get(id: string) {
    return this.repo.findById(id);
  }

  list(limit = 20, offset = 0) {
    return this.repo.list(limit, offset);
  }
}
