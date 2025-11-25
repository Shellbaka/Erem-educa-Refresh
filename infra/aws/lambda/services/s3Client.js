import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const defaultRegion = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

export const s3Client = new S3Client({
  region: defaultRegion,
});

export async function saveJson({ bucket, key, body }) {
  if (!bucket) {
    throw new Error('S3 bucket name is required.');
  }

  const payload = typeof body === 'string' ? body : JSON.stringify(body, null, 2);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: payload,
    ContentType: 'application/json',
  });

  await s3Client.send(command);
}


