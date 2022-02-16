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

  const { response: integrations } = await client.fetchIntegrations();

  for (const integration of integrations) {
    const integrationEntity = await jobState.addEntity(
      convertIntegration(integration),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: integrationEntity,
      }),
    );
  }
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
