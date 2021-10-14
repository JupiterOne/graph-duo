import * as crypto from 'crypto';

interface BuildAuthHeaderOptions {
  date: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  host: string;
  path: string;
  params: string;
  integrationKey: string;
  secretKey: string;
}

export default function buildAuthHeader(input: BuildAuthHeaderOptions): string {
  return Buffer.from(
    `${input.integrationKey}:${buildAuthDigest(input)}`,
  ).toString('base64');
}

export function buildAuthDigest({
  date,
  method,
  host,
  path,
  params,
  secretKey,
}: BuildAuthHeaderOptions): string {
  const lines = [date, method, host, path, params].join('\n');
  const h = crypto.createHmac('sha1', secretKey);
  h.update(lines);
  return h.digest('hex');
}
