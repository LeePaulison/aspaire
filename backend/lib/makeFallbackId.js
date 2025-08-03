import crypto from 'crypto';

export function makeFallbackId(job) {
  const hash = crypto.createHash('sha256');
  hash.update(`${job.title}-${job.company}-${job.location}-${job.source}`);
  return hash.digest('hex');
}
