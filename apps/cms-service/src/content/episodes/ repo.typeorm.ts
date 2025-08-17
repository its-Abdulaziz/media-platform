import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from '../../entities/episode.entity.js';
import { EpisodesRepo } from './ repo'; 
@Injectable()        
export class EpisodesRepoTypeOrm implements EpisodesRepo {
  constructor(@InjectRepository(Episode) private readonly repo: Repository<Episode>) {}

  async create(data: { 
    program_id: string;
    title: string;
    description?: string|null;
    media_url?: string|null;
    duration_seconds?: number|null;
    published_at?: Date|null;
  }) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<Episode>) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Episode not found');
    Object.assign(found, data);
    return this.repo.save(found);
  }

  async delete(id: string) {
    const res = await this.repo.delete({ id });
    if (!res.affected) throw new NotFoundException('Episode not found');
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async listByProgram(program_id: string, limit: number, offset: number) {
    const [items, total] = await this.repo.findAndCount({
      where: { program_id },
      order: { published_at: 'DESC', created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
    return { items, total };
  }
}
