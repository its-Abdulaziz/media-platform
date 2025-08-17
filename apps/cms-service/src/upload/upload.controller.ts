import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { UploadsService } from './upload.service';

function buildKey(filename: string, programId?: string) {
  const ext = (filename.split('.').pop() || 'bin').toLowerCase();
  const uid = crypto.randomUUID();
  const base = programId ? `programs/${programId}/episodes` : 'uploads';
  return `${base}/${uid}.${ext}`;
}

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Get('presign-put')
  async presignPut(
    @Query('filename') filename?: string,
    @Query('contentType') contentType?: string,
    @Query('programId') programId?: string,
  ) {
    if (!filename || !contentType) throw new BadRequestException('filename and contentType are required');
    const key = buildKey(filename, programId);
    return this.uploads.presignPut({ key, contentType });
  }
}
