import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk';

import ServicesClient from '../../collector/ServicesClient';
import { convertUser } from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-users',
  name: 'Fetch Users',
  types: ['duo-user'],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const { apiHostname, integrationKey, secretKey } = instance.config || {};

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

    const client = new ServicesClient({
      apiHostname,
      integrationKey,
      secretKey,
    });

    const { response: users } = await client.fetchUsers();
    await jobState.addEntities(users.map(convertUser));
  },
};

export default step;
