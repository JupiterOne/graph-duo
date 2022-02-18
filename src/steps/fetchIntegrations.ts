import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  RelationshipClass,
  Entity,
  IntegrationError,
} from '@jupiterone/integration-sdk-core';
import { createDuoClient } from '../collector';
import { DuoIntegrationConfig } from '../types';
import { DuoIntegration, Response } from '../collector/types';
import { Entities, Relationships, Steps, ACCOUNT_ENTITY } from '../constants';
import { convertIntegration } from '../converter';

async function fetchIntegrations(
  context: IntegrationStepExecutionContext<DuoIntegrationConfig>,
): Promise<void> {
  const { instance, jobState } = context;
  const client = createDuoClient(instance.config);

  const accountEntity = await jobState.getData<Entity>(ACCOUNT_ENTITY);

  if (!accountEntity) {
    throw new IntegrationError({
      code: 'MISSING_ACCOUNT_ENTITY',
      message:
        'Missing account entity. Cannot ingest Duo integration entities.',
      fatal: true,
    });
  }

  //Integrations
  await client.fetchWithPagination<Response<DuoIntegration[]>>(
    'integrations',
    (response) => {
      const integrations = response.response;
      integrations.forEach(async (integration) => {
        const integrationEntity = convertIntegration(integration);
        await jobState.addEntity(integrationEntity);

        await jobState.addRelationship(
          createDirectRelationship({
            from: accountEntity,
            to: integrationEntity,
            _class: RelationshipClass.HAS,
          }),
        );
      });
    },
  );
}

const step: IntegrationStep<DuoIntegrationConfig> = {
  id: Steps.FETCH_INTEGRATIONS,
  name: 'Fetch Integrations',
  entities: [Entities.INTEGRATION],
  relationships: [Relationships.ACCOUNT_HAS_INTEGRATION],
  dependsOn: [Steps.FETCH_USERS],
  executionHandler: fetchIntegrations,
};

export default step;
