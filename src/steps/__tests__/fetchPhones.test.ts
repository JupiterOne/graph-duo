import { createStepContext } from '../../../test';
import { Recording } from '@jupiterone/integration-sdk-testing';
import fetchPhones from '../fetchPhones';
import { setupDuoRecording } from '../../../test/setupDuoRecording';
import { Entities } from '../../constants';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('step - fetch phones', async () => {
  recording = setupDuoRecording({
    name: 'fetchPhones',
    directory: __dirname,
  });

  const context = createStepContext();
  await fetchPhones.executionHandler(context);
  const entities = context.jobState.collectedEntities;

  expect(entities.length).toBeGreaterThan(0);
  expect(entities).toMatchGraphObjectSchema({
    _class: Entities.PHONE._class,
    schema: {},
  });
});
