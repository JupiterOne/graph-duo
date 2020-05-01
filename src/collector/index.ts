import DuoClient from './DuoClient';
import { DuoClientConfiguration } from './types';

export * from './types';

/**
 * Creates a DuoClient.
 */
export function createDuoClient(config: DuoClientConfiguration): DuoClient {
  const { apiHostname, integrationKey, secretKey } = config || {};

  if (!apiHostname) {
    throw new Error(
      'Configuration option "apiHostname" is missing on the integration instance config',
    );
  }

  if (!integrationKey) {
    throw new Error(
      'Configuration option "integrationKey" is missing on the integration instance config',
    );
  }

  if (!secretKey) {
    throw new Error(
      'Configuration option "secretKey" is missing on the integration instance config',
    );
  }

  const match = apiHostname.match(/api-(\w+)\.duosecurity\.com/i);
  const siteId = match && match[1];

  if (!siteId) {
    throw new Error(
      'Invalid "apiHostname". "apiHostname" should be in this format: "https://api-XXXXXXXX.duosecurity.com"',
    );
  }

  return new DuoClient(config, siteId);
}
