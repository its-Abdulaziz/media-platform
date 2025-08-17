import { Program } from '../../entities/program.entity.js';

export interface ProgramsRepo {
  create(data: { title: string; type: Program['type']; status: Program['status']; content_manager_id: string|null }): Promise<Program>;
  update(id: string, data: Partial<Pick<Program,'title'|'type'|'status'>>): Promise<Program>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Program|null>;
  list(limit: number, offset: number): Promise<{ items: Program[]; total: number }>;
}
