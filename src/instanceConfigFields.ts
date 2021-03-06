import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
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
