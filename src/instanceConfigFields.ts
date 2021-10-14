import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { DuoIntegrationConfig } from './types';

const instanceConfigFields: IntegrationInstanceConfigFieldMap<DuoIntegrationConfig> =
  {
    apiHostname: {
      type: 'string',
      mask: false,
    },
    integrationKey: {
      type: 'string',
      mask: false,
    },
    secretKey: {
      type: 'string',
      mask: true,
    },
  };

export default instanceConfigFields;
