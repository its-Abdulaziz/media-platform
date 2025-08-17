import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { ContentManager } from './content-manager.entity.js';
  import { Episode } from './episode.entity';
  
  export type ProgramType = 'podcast' | 'documentary' | 'video' | 'playlist';
  export type ProgramStatus = 'draft' | 'review' | 'published' | 'archived';
  
  @Index('idx_programs_content_manager_id', ['content_manager_id'])
  @Index('idx_programs_published_at', ['published_at']) // note: SQL created DESC index; this is metadata only
  @Index('idx_programs_title', ['title'])
  @Entity({ name: 'programs' })
  export class Program {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'text' })
    title!: string;
  
    @Column({ type: 'text', default: 'podcast' })
    type!: ProgramType;
  
    @Column({ type: 'timestamptz', nullable: true })
    published_at!: Date | null;
  
    @Column({ type: 'text', default: 'draft' })
    status!: ProgramStatus;
  
    // FK column (nullable SET NULL)
    @Column({ type: 'uuid', nullable: true })
    content_manager_id!: string | null;
  
    // Relation helper (optional but handy)
    @ManyToOne(() => ContentManager, (cm) => cm.programs, { nullable: true, onDelete: 'SET NULL' })
    content_manager!: ContentManager | null;
  
    @CreateDateColumn({ type: 'timestamptz' })
    created_at!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at!: Date;
  
    @OneToMany(() => Episode, (e) => e.program)
    episodes!: Episode[];
  }
  