import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { convertUser, convertPhone } from '../converter';
import { createDuoClient } from '../collector';
import { DuoIntegrationConfig } from '../types';
import { Entities, Relationships, Steps } from '../constants';

async function fetchPhones(
  context: IntegrationStepExecutionContext<DuoIntegrationConfig>,
): Promise<void> {
  const { instance, jobState } = context;
  const client = createDuoClient(instance.config);

  await client.iteratePhones(async (phone) => {
    const phoneEntity = convertPhone(phone);
    await jobState.addEntity(phoneEntity);

    for (const user of phone.users) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.USES,
          from: convertUser(user),
          to: phoneEntity,
        }),
      );
    }
  });
}

const step: IntegrationStep<DuoIntegrationConfig> = {
  id: Steps.FETCH_PHONES,
  name: 'Fetch Phones',
  entities: [Entities.PHONE],
  relationships: [Relationships.USER_USES_PHONE],
  dependsOn: [Steps.FETCH_USERS],
  executionHandler: fetchPhones,
};

export default step;
