import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  const key = req.nextUrl.searchParams.get('key');

  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing key parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: 'aspaire-resumes',
      Key: key,
    }),
    { expiresIn: 60 * 5 }
  );

  return new Response(JSON.stringify({ signedUrl }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
