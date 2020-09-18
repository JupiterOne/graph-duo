import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  RelationshipClass,
  Relationship,
  Entity,
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
import { DuoIntegrationConfig } from '../../types';
import { Entities, Relationships } from '../../constants';

const step: IntegrationStep<DuoIntegrationConfig> = {
  id: 'fetch-users',
  name: 'Fetch Users',
  entities: [
    Entities.ACCOUNT,
    Entities.ADMIN,
    Entities.USER,
    Entities.USER_GROUP,
    Entities.MFA_DEVICE,
  ],
  relationships: [
    Relationships.ACCOUNT_HAS_GROUP,
    Relationships.ACCOUNT_HAS_ADMIN,
    Relationships.ACCOUNT_HAS_USER,
    Relationships.GROUP_HAS_USER,
    Relationships.USER_ASSIGNED_DEVICE,
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
    const adminEntities: Entity[] = [];
    const groupEntities: Entity[] = groups.map(convertGroup);
    const userEntities: Entity[] = [];
    const mfaTokenEntities: Entity[] = [];

    const accountUserRelationships: Relationship[] = [];
    const accountAdminRelationships: Relationship[] = [];
    const groupUserRelationships: Relationship[] = [];
    const userMfaRelationships: Relationship[] = [];

    admins.forEach((admin) => {
      const adminEntity = convertAdmin(admin);
      adminEntities.push(adminEntity);

      accountAdminRelationships.push(
        createDirectRelationship({
          from: accountEntity,
          to: adminEntity,
          _class: RelationshipClass.HAS,
        }),
      );
    });

    users.forEach((user) => {
      const userEntity = convertUser(user);
      userEntities.push(userEntity);

      accountUserRelationships.push(
        createDirectRelationship({
          from: accountEntity,
          to: userEntity,
          _class: RelationshipClass.HAS,
        }),
      );

      user.groups &&
        user.groups.forEach((group) => {
          const groupEntity = convertGroup(group);
          groupUserRelationships.push(
            createDirectRelationship({
              from: groupEntity,
              to: userEntity,
              _class: RelationshipClass.HAS,
            }),
          );
        });

      user.tokens &&
        user.tokens.forEach((token) => {
          const tokenEntity = convertToken(token);
          mfaTokenEntities.push(tokenEntity);
          userMfaRelationships.push(
            createDirectRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: RelationshipClass.ASSIGNED,
            }),
          );
        });

      user.u2ftokens &&
        user.u2ftokens.forEach((token) => {
          const tokenEntity = convertU2fToken(token);
          mfaTokenEntities.push(tokenEntity);
          userMfaRelationships.push(
            createDirectRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: RelationshipClass.ASSIGNED,
            }),
          );
        });

      user.webauthncredentials &&
        user.webauthncredentials.forEach((token) => {
          const tokenEntity = convertWebAuthnToken(token);
          mfaTokenEntities.push(tokenEntity);
          userMfaRelationships.push(
            createDirectRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: RelationshipClass.ASSIGNED,
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
