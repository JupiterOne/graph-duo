import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import {
  convertUser,
  convertToken,
  convertU2fToken,
  convertWebAuthnToken,
  convertAccount,
  convertAdmin,
  convertGroup,
} from '../converter';
import { createDuoClient } from '../collector';
import { DuoIntegrationConfig } from '../types';
import { Entities, Relationships, ACCOUNT_ENTITY, Steps } from '../constants';

const step: IntegrationStep<DuoIntegrationConfig> = {
  id: Steps.FETCH_USERS,
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

    // TODO - Should this step be broken out into separate fetchAccount, fetchUsers
    // fetchGroups, and fetchAdmins?  Fetching tokens should probably stay with
    // users.

    const accountResponse = await client.fetchAccountSettings();
    const accountEntity = convertAccount(
      client.siteId,
      accountResponse.response,
    );
    await jobState.setData(ACCOUNT_ENTITY, accountEntity);
    await jobState.addEntity(accountEntity);

    await client.iterateAdmins(async (admin) => {
      const adminEntity = convertAdmin(admin);
      await jobState.addEntity(adminEntity);

      await jobState.addRelationship(
        createDirectRelationship({
          from: accountEntity,
          to: adminEntity,
          _class: RelationshipClass.HAS,
        }),
      );
    });

    await client.iterateGroups(async (group) => {
      const groupEntity = convertGroup(group);
      await jobState.addEntity(groupEntity);

      await jobState.addRelationship(
        createDirectRelationship({
          from: accountEntity,
          to: groupEntity,
          _class: RelationshipClass.HAS,
        }),
      );
    });

    await client.iterateUsers(async (user) => {
      const userEntity = convertUser(user);
      await jobState.addEntity(userEntity);

      await jobState.addRelationship(
        createDirectRelationship({
          from: accountEntity,
          to: userEntity,
          _class: RelationshipClass.HAS,
        }),
      );

      if (user.groups) {
        for (const group of user.groups) {
          const groupEntity = convertGroup(group);
          await jobState.addRelationship(
            createDirectRelationship({
              from: groupEntity,
              to: userEntity,
              _class: RelationshipClass.HAS,
            }),
          );
        }
      }

      if (user.tokens) {
        for (const token of user.tokens) {
          const tokenEntity = convertToken(token);
          await jobState.addEntity(tokenEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: RelationshipClass.ASSIGNED,
            }),
          );
        }
      }

      if (user.u2ftokens) {
        for (const token of user.u2ftokens) {
          const tokenEntity = convertU2fToken(token);
          await jobState.addEntity(tokenEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: RelationshipClass.ASSIGNED,
            }),
          );
        }
      }

      if (user.webauthncredentials) {
        for (const token of user.webauthncredentials) {
          const tokenEntity = convertWebAuthnToken(token);
          await jobState.addEntity(tokenEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              from: userEntity,
              to: tokenEntity,
              _class: RelationshipClass.ASSIGNED,
            }),
          );
        }
      }
    });
  },
};

export default step;
