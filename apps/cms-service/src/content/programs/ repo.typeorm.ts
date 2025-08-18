import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities/program.entity';
import { ProgramsRepo } from './ repo.js';

@Injectable()
export class ProgramsRepoTypeOrm implements ProgramsRepo {
  constructor(@InjectRepository(Program) private readonly repo: Repository<Program>) {}

  async create(data: { title: string; type: Program['type']; status: Program['status']; content_manager_id: string|null }) {
    const entity = this.repo.create({
      title: data.title,
      type: data.type ?? 'podcast',
      status: data.status ?? 'draft',
      content_manager_id: data.content_manager_id,
      published_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<Pick<Program,'title'|'type'|'status'>>) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) 
        throw new NotFoundException('Program not found');

    Object.assign(found, data);
    return this.repo.save(found);
  }

  async delete(id: string) {
    const res = await this.repo.delete({ id });
    if (!res.affected) 
        throw new NotFoundException('Program not found');
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async list(limit: number, offset: number) {
    const [items, total] = await this.repo.findAndCount({
      order: { published_at: 'DESC', created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
    return { items, total };
  }
}
