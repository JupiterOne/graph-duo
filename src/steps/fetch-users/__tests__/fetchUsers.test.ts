import { createStepContext } from 'test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk/testing';
import fetchTeams from '../fetchUsers';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('should fetch users in account', async () => {
  recording = setupRecording({
    name: 'users',
    directory: __dirname,
    redactedRequestHeaders: ['secret-key'],
    options: {
      recordFailedRequests: false,
      matchRequestsBy: {
        url: {
          query: false,
        },
      },
    },
  });

  const context = createStepContext();
  await fetchTeams.executionHandler(context);
  const entities = context.jobState.collectedEntities;

  console.log(JSON.stringify(entities, null, 2));
  expect(entities).toHaveLength(4);
  expect(entities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        email: 'byricketts98@gmail.com',
        notes: [''],
        status: 'active',
        username: 'bruce',
        _key: 'duo-user:DUHBVLNGTNJFT6W6O5F0',
        _type: 'duo_user',
        _class: ['User'],
        id: 'DUHBVLNGTNJFT6W6O5F0',
        name: 'Bruce Ricketts',
        displayName: 'Bruce Ricketts',
        createdOn: 1587672033,
        active: true,
        mfaEnabled: true,
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
