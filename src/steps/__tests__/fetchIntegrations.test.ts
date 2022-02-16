import { createStepContext } from '../../../test';
import { Recording } from '@jupiterone/integration-sdk-testing';
import fetchIntegrations from '../fetchIntegrations';
import { setupDuoRecording } from '../../../test/setupDuoRecording';
import { Entities } from '../../constants';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('step - fetch integrations', async () => {
  recording = setupDuoRecording({
    name: 'fetchIntegrations',
    directory: __dirname,
  });

  const context = createStepContext({
    apiHostname: 'api-be7ff7c0.duosecurity.com',
  });

  context.jobState.getData = jest.fn().mockResolvedValue({
    _type: Entities.ACCOUNT._type,
    _class: Entities.ACCOUNT._class,
  });

  await fetchIntegrations.executionHandler(context);
  const entities = context.jobState.collectedEntities;

  expect(entities.length).toBeGreaterThan(0);
  expect(entities).toMatchGraphObjectSchema({
    _class: [Entities.INTEGRATION._class],
    schema: {
      additionalProperties: false,
      properties: {
        _type: { const: 'duo_integration' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
        id: { type: 'string' },
        name: { type: 'string' },
        notes: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  });
});
