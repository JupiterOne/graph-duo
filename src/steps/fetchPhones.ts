import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { convertUser, convertPhone } from '../converter';
import { createDuoClient, DuoPhone, DuoUser } from '../collector';
import { DuoIntegrationConfig } from '../types';
import { Entities, Relationships, Steps } from '../constants';

async function fetchPhones(
  context: IntegrationStepExecutionContext<DuoIntegrationConfig>,
): Promise<void> {
  const { instance, jobState } = context;
  const client = createDuoClient(instance.config);

  const { response: phones } = await client.fetchPhones();

  phones.forEach(async (phone: DuoPhone) => {
    const phoneEntity = await jobState.addEntity(convertPhone(phone));

    phone.users.forEach(async (user: DuoUser) => {
      const userEntity = convertUser(user);

      console.log(userEntity);

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.USES,
          from: convertUser(user),
          to: phoneEntity,
        }),
      );
    });
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
