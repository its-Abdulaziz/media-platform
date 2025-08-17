import { Episode } from '../../entities/episode.entity.js';

export interface EpisodesRepo {
  create(data: {
    program_id: string;
    title: string;
    description?: string|null;
    media_url?: string|null;
    duration_seconds?: number|null;
    published_at?: Date|null;
  }): Promise<Episode>;

  update(id: string, data: Partial<Omit<Episode,'id'|'program'>>): Promise<Episode>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Episode|null>;
  listByProgram(program_id: string, limit: number, offset: number): Promise<{ items: Episode[]; total: number }>;
}
