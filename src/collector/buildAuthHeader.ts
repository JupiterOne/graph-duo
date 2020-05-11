import base64 from 'base-64';
import crypto from 'crypto';

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
  return base64.encode(`${input.integrationKey}:${buildAuthDigest(input)}`);
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
