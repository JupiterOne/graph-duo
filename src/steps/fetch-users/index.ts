import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk';

import ServicesClient from '../../collector/ServicesClient';
import {
  convertUser,
  convertToken,
  convertU2fToken,
  convertWebAuthnToken,
  convertAccount,
  convertAdmin,
  convertGroup,
} from '../../converter';

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

    const match = apiHostname.match(/api-(\w+)\.duosecurity\.com/i);
    const siteId = match && match[1];

    if (!siteId) {
      throw new Error(
        'Invalid "apiHostname". "apiHostname" should be in this format: "https://api-XXXXXXXX.duosecurity.com"',
      );
    }

    const client = new ServicesClient({
      apiHostname,
      integrationKey,
      secretKey,
    });

    const { response: settings } = await client.fetchAccountSettings();
    const { response: admins } = await client.fetchAdmins();
    const { response: groups } = await client.fetchGroups();
    const { response: users } = await client.fetchUsers();

    const accountEntity = convertAccount(siteId, settings);
    const adminEntities = [];
    const groupEntities = groups.map(convertGroup);
    const userEntities = [];
    const mfaTokenEntities = [];

    const accountUserRelationships = [];
    const accountAdminRelationships = [];
    const groupUserRelationships = [];
    const userMfaRelationships = [];

    admins.forEach((admin) => {
      const adminEntity = convertAdmin(admin);
      adminEntities.push(adminEntity);

      accountAdminRelationships.push(
        createIntegrationRelationship({
          from: accountEntity,
          to: adminEntity,
          _class: 'HAS',
        }),
      );
    });

    users.forEach((user) => {
      const userEntity = convertUser(user);
      userEntities.push(userEntity);

      accountUserRelationships.push(
        createIntegrationRelationship({
          from: accountEntity,
          to: userEntity,
          _class: 'HAS',
        }),
      );

      user.groups &&
        user.groups.forEach((group) => {
          const groupEntity = convertToken(group);
          groupUserRelationships.push(
            createIntegrationRelationship({
              from: groupEntity,
              to: userEntity,
              _class: 'HAS',
            }),
          );
        });

      user.tokens &&
        user.tokens.forEach((token) => {
          const tokenEntity = convertToken(token);
          mfaTokenEntities.push(tokenEntity);
          userMfaRelationships.push(
            createIntegrationRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: 'ASSIGNED',
            }),
          );
        });

      user.u2ftokens &&
        user.u2ftokens.forEach((token) => {
          const tokenEntity = convertU2fToken(token);
          mfaTokenEntities.push(tokenEntity);
          userMfaRelationships.push(
            createIntegrationRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: 'ASSIGNED',
            }),
          );
        });

      user.webauthncredentials &&
        user.webauthncredentials.forEach((token) => {
          const tokenEntity = convertWebAuthnToken(token);
          mfaTokenEntities.push(tokenEntity);
          userMfaRelationships.push(
            createIntegrationRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: 'ASSIGNED',
            }),
          );
        });
    });

    await Promise.all([
      jobState.addEntities([accountEntity]),
      jobState.addEntities(adminEntities),
      jobState.addEntities(groupEntities),
      jobState.addEntities(userEntities),
      jobState.addEntities(mfaTokenEntities),
      jobState.addRelationships(accountAdminRelationships),
      jobState.addRelationships(accountUserRelationships),
      jobState.addRelationships(groupUserRelationships),
      jobState.addRelationships(userMfaRelationships),
    ]);
  },
};

export default step;
