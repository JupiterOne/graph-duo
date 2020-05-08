import DuoClient from './DuoClient';
import { DuoClientConfiguration } from './types';

export * from './types';

/**
 * Creates a `DuoClient`.
 *
 * @throws error when configuration is missing any required property.
 */
export function createDuoClient(config: DuoClientConfiguration): DuoClient {
  const { apiHostname, integrationKey, secretKey } = config || {};

  if (!apiHostname || !integrationKey || !secretKey) {
    throw new Error(
      'Configuration requires all of { apiHostname, integrationKey, secretKey }',
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
