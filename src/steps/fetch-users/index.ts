import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk-core';
import {
  convertUser,
  convertToken,
  convertU2fToken,
  convertWebAuthnToken,
  convertAccount,
  convertAdmin,
  convertGroup,
} from '../../converter';
import { createDuoClient } from '../../collector';
import { DuoIntegrationConfig } from 'src/types';

const step: IntegrationStep = {
  id: 'fetch-users',
  name: 'Fetch Users',
  types: [
    'duo_account',
    'duo_admin',
    'duo_user',
    'duo_group',
    'mfa_device',
    'duo_account_has_group',
    'duo_account_has_admin',
    'duo_account_has_user',
    'duo_group_has_user',
    'duo_user_assigned_device',
  ],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext<DuoIntegrationConfig>) {
    const client = createDuoClient(instance.config);

    const { response: settings } = await client.fetchAccountSettings();
    const { response: admins } = await client.fetchAdmins();
    const { response: groups } = await client.fetchGroups();
    const { response: users } = await client.fetchUsers();

    const accountEntity = convertAccount(client.siteId, settings);
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
