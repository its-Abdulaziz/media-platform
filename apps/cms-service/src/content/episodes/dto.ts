import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateEpisodeDto {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() mediaUrl?: string;
  @IsOptional() @IsInt() @Min(0) durationSeconds?: number;
}

export class UpdateEpisodeDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() mediaUrl?: string;
  @IsOptional() @IsInt() @Min(0) durationSeconds?: number;
}
