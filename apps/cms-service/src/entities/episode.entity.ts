import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Program } from './program.entity';
  
  @Index('idx_episodes_program_id', ['program_id'])
  @Index('idx_episodes_published_at', ['published_at'])
  // GIN indexes from SQL: idx_episodes_search on (search_vec), idx_episodes_title_trgm on (title)
  @Entity({ name: 'episodes' })
  export class Episode {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    // FK column
    @Column({ type: 'uuid' })
    program_id!: string;
  
    @ManyToOne(() => Program, (p) => p.episodes, { onDelete: 'CASCADE' })
    program!: Program;
  
    @Column({ type: 'text' })
    title!: string;
  
    @Column({ type: 'text', nullable: true })
    description!: string | null;
  
    @Column({ type: 'text', nullable: true })
    media_url!: string | null;
  
    @Column({ type: 'int', nullable: true })
    duration_seconds!: number | null;
  
    @Column({ type: 'timestamptz', nullable: true })
    published_at!: Date | null;
  
    @CreateDateColumn({ type: 'timestamptz' })
    created_at!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at!: Date;
  
    // tsvector column (kept by DB trigger). We usually don't fetch it.
    @Column({ type: 'tsvector', nullable: true, select: false })
    search_vec!: any | null;
  }
  