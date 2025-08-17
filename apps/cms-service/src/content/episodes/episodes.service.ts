import { Inject, Injectable } from '@nestjs/common';
import { EPISODES_REPO } from '../shared/tokens.js';
import { EpisodesRepoTypeOrm } from './ repo.typeorm';

@Injectable()
export class EpisodesService {
  constructor(@Inject(EPISODES_REPO) private readonly repo: EpisodesRepoTypeOrm) {}

  create(programId: string, dto: {
    title: string; description?: string; mediaUrl?: string; durationSeconds?: number; publishedAt?: string;
  }) {
    return this.repo.create({
      program_id: programId,
      title: dto.title,
      description: dto.description ?? null,
      media_url: dto.mediaUrl ?? null,
      duration_seconds: dto.durationSeconds ?? null,
      published_at: dto.publishedAt ? new Date(dto.publishedAt) : null,
    });
  }

  update(id: string, dto: {
    title?: string; description?: string; mediaUrl?: string; durationSeconds?: number; publishedAt?: string;
  }) {
    return this.repo.update(id, {
      title: dto.title,
      description: dto.description,
      media_url: dto.mediaUrl,
      duration_seconds: dto.durationSeconds,
      published_at: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    } as any);
  }

  remove(id: string) { return this.repo.delete(id); }

  get(id: string) { return this.repo.findById(id); }
  
  listByProgram(programId: string, limit = 20, offset = 0) {
    return this.repo.listByProgram(programId, limit, offset);
  }
}
