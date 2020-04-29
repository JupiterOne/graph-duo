const base64 = require('base-64');
const crypto = require('crypto');

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
}: BuildAuthHeaderOptions) {
  const lines = [date, method, host, path, params].join('\n');
  const h = crypto.createHmac('sha1', secretKey);
  h.update(lines);
  const signature = h.digest('hex');
  return base64.encode(`${integrationKey}:${signature}`);
}
