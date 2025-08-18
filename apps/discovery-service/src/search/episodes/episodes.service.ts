import { Inject, Injectable } from '@nestjs/common';
import { TypeormEpisodesSearchRepo } from './repo.typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
@Injectable()
export class EpisodesService {
  constructor(private readonly repo: TypeormEpisodesSearchRepo,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,

  ) {}

  private key(q: string, page: number, size: number) {
    return `episodes:search:q=${q.trim()}:p=${page}:s=${size}`;
  }

  async search(q: string, page = 1, size = 20) {
    const query = (q ?? '').trim();

    if (!query) 
        return { items: [], page, size };

    const cacheKey = this.key(query, page, size);

    console.log(cacheKey);
    const cached = await this.cache.get<any>(cacheKey);
    console.log(cached);
    if (cached) 
        return cached;

    const result = await this.repo.search(query, page, size);

    const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS ?? 1800);
    await this.cache.set(cacheKey, result, ttlSeconds);

    return result;
  }
}
