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

export default function buildAuthHeader({
  date,
  method,
  host,
  path,
  params,
  integrationKey,
  secretKey,
}: BuildAuthHeaderOptions): string {
  const lines = [date, method, host, path, params].join('\n');
  const h = crypto.createHmac('sha1', secretKey);
  h.update(lines);
  const signature = h.digest('hex');
  return base64.encode(`${integrationKey}:${signature}`);
}
