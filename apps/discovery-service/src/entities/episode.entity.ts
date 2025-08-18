import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'episodes' })
export class EpisodeEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() program_id: string;
  @Column() title: string;
  @Column() description: string;
  @Column() media_url: string;
  @Column() duration_seconds: number;
  @Column() published_at: Date;
}
