import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadsService {
  private readonly bucket = process.env.R2_BUCKET!;
  private readonly s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT, 
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  async presignPut(params: { key: string; contentType: string; expiresSec?: number }) {
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      ContentType: params.contentType,
    });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn: params.expiresSec ?? 600 }); 
    return { key: params.key, url }; 
  }
}
