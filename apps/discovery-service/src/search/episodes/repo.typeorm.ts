import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EpisodesSearchRepo, EpisodeHit } from './repo';
import { EpisodeEntity } from '../../entities/episode.entity';

export class TypeormEpisodesSearchRepo implements EpisodesSearchRepo {
  constructor(
    @InjectRepository(EpisodeEntity)
    private readonly episodesRepo: Repository<EpisodeEntity>,
  ) {}

  async search(q: string, page: number, size: number) {
    const offset = (page - 1) * size;

    const sql = `
      SELECT s.id, s.program_id, s.title, s.description, s.media_url, s.published_at,
             p.title AS program_title
      FROM search_episodes($1, $2, $3) AS s
      JOIN programs p ON p.id = s.program_id
      ORDER BY s.rank DESC, s.published_at DESC NULLS LAST;
    `;

    const rows: any[] = await this.episodesRepo.query(sql, [q.trim(), size, offset]);

    const items: EpisodeHit[] = rows.map(r => ({
      id: r.id,
      program_id: r.program_id,
      title: r.title,
      description: r.description ?? null,
      media_url: r.media_url ?? null,
      published_at: r.published_at ?? null,
      program_title: r.program_title,
      duration_seconds: r.duration_seconds ?? null,
    }));
    return { items, page, size };
  }
}
