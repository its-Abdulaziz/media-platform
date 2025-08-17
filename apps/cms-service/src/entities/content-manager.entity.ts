import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { Program } from './program.entity';  

  @Index('idx_cm_active', ['is_active']) // FYI only; index is created by SQL
  @Entity({ name: 'content_managers' })
  export class ContentManager {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'text', unique: true })
    email!: string;
  
    @Column({ type: 'text' })
    name!: string;
  
    @Column({ type: 'text' })
    password_hash!: string;
  
    @Column({ type: 'boolean', default: true })
    is_active!: boolean;
  
    @Column({ type: 'timestamptz', nullable: true })
    last_login_at!: Date | null;
  
    @CreateDateColumn({ type: 'timestamptz' })
    created_at!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at!: Date;
  
    // Relations
    @OneToMany(() => Program, (p) => p.content_manager)
    programs!: Program[];
  }
  