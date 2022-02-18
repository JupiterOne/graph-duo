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
import { DuoAdmin, DuoGroup, DuoUser, Response } from '../collector/types';
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
    // fetchGroups, and fetchTokens?

    //Account - No pagination available or needed for this call.
    const accountResponse = await client.fetchWithRetry('settings');
    const accountEntity = convertAccount(
      client.siteId,
      accountResponse.response,
    );
    await jobState.setData(ACCOUNT_ENTITY, accountEntity);
    await jobState.addEntity(accountEntity);

    //Admins
    await client.fetchWithPagination<Response<DuoAdmin[]>>(
      'admins',
      (response) => {
        const admins = response.response;
        admins.forEach(async (admin) => {
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
      },
    );

    //Groups
    await client.fetchWithPagination<Response<DuoGroup[]>>(
      'groups',
      (response) => {
        const groups = response.response;
        groups.forEach(async (group) => {
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
      },
    );

    //Users
    await client.fetchWithPagination<Response<DuoUser[]>>(
      'users',
      (response) => {
        const users = response.response;
        users.forEach(async (user) => {
          const userEntity = convertUser(user);
          await jobState.addEntity(userEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              from: accountEntity,
              to: userEntity,
              _class: RelationshipClass.HAS,
            }),
          );

          user.groups &&
            user.groups.forEach(async (group) => {
              const groupEntity = convertGroup(group);
              await jobState.addRelationship(
                createDirectRelationship({
                  from: groupEntity,
                  to: userEntity,
                  _class: RelationshipClass.HAS,
                }),
              );
            });

          user.tokens &&
            user.tokens.forEach(async (token) => {
              const tokenEntity = convertToken(token);
              await jobState.addEntity(tokenEntity);
              await jobState.addRelationship(
                createDirectRelationship({
                  from: userEntity,
                  to: tokenEntity,
                  _class: RelationshipClass.ASSIGNED,
                }),
              );
            });

          user.u2ftokens &&
            user.u2ftokens.forEach(async (token) => {
              const tokenEntity = convertU2fToken(token);
              await jobState.addEntity(tokenEntity);
              await jobState.addRelationship(
                createDirectRelationship({
                  from: userEntity,
                  to: tokenEntity,
                  _class: RelationshipClass.ASSIGNED,
                }),
              );
            });

          user.webauthncredentials &&
            user.webauthncredentials.forEach(async (token) => {
              const tokenEntity = convertWebAuthnToken(token);
              await jobState.addEntity(tokenEntity);
              await jobState.addRelationship(
                createDirectRelationship({
                  from: userEntity,
                  to: tokenEntity,
                  _class: RelationshipClass.ASSIGNED,
                }),
              );
            });
        });
      },
    );
  },
};

export default step;
