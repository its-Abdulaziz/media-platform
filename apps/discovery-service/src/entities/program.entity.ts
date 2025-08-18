import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'programs' })
export class ProgramEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column() type: string;
  @Column() published_at: Date;
}
