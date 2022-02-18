import { createStepContext } from '../../../test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';
import step from '../fetchUsers';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('should fetch users in account', async () => {
  recording = setupRecording({
    name: 'users',
    directory: __dirname,
  });

  const context = createStepContext();
  await step.executionHandler(context);
  const entities = context.jobState.collectedEntities;

  expect(entities).toHaveLength(5);
  expect(entities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        email: 'adam.pierson@jupiterone.com',
        status: 'active',
        username: 'adam.pierson@jupiterone.com',
        _type: 'duo_admin',
        _class: ['User'],
        name: 'Adam Pierson',
        displayName: 'Adam Pierson',
        active: true,
      }),
      expect.objectContaining({
        email: 'austin.kelleher+duotest@jupiterone.com',
        status: 'active',
        username: 'austinkellehertest',
        _type: 'duo_user',
        _class: ['User'],
        name: 'Austin Kelleher Test',
        displayName: 'Austin Kelleher Test',
        active: true,
      }),
    ]),
  );
});
