import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateProgramDto {
  @IsString() title!: string;

  @IsOptional()
  @IsIn(['podcast','documentary','video','playlist'])
  type?: 'podcast'|'documentary'|'video'|'playlist';

  @IsOptional()
  @IsIn(['draft','review','published','archived'])
  status?: 'draft'|'review'|'published'|'archived';
}

export class UpdateProgramDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsIn(['podcast','documentary','video','playlist'])
  type?: 'podcast'|'documentary'|'video'|'playlist';
  @IsOptional() @IsIn(['draft','review','published','archived'])
  status?: 'draft'|'review'|'published'|'archived';
}
