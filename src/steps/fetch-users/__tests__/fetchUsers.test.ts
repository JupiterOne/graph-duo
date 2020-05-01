import { createStepContext } from 'test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk/testing';
import fetchUsers from '../fetchUsers';

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
  await fetchUsers.executionHandler(context);
  const entities = context.jobState.collectedEntities;

  expect(entities).toHaveLength(4);
  expect(entities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        email: 'bruce@jupiterone.io',
        status: 'active',
        username: 'bruce@jupiterone.io',
        _type: 'duo_admin',
        _class: ['User'],
        name: 'Bruce',
        displayName: 'Bruce',
        active: true,
      }),
      expect.objectContaining({
        _key: 'mfa-device:DH9K9HUHLNXCP2E4Z0O9',
        _type: 'mfa_device',
        _class: ['AccessKey'],
        id: 'DH9K9HUHLNXCP2E4Z0O9',
        name: 'DH9K9HUHLNXCP2E4Z0O9',
        displayName: 'DH9K9HUHLNXCP2E4Z0O9',
        serial: '123abc',
        type: 'h6',
        factorType: 'token',
      }),
    ]),
  );
});
