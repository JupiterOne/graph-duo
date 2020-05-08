/* eslint-disable @typescript-eslint/camelcase */
import {
  createMockStepExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk/testing';

import { createDuoClient } from '../';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

describe('fetchUsers', () => {
  beforeEach(() => {
    recording = setupRecording({
      directory: __dirname,
      name: 'fetchUsers',
    });
  });

  test('okay', async () => {
    const context = createMockStepExecutionContext();
    const provider = createDuoClient(context.instance.config);

    const response = await provider.fetchUsers();

    expect(response).toEqual({
      metadata: { total_objects: 1 },
      response: [
        {
          alias1: null,
          alias2: null,
          alias3: null,
          alias4: null,
          created: 1587672033,
          desktoptokens: [],
          email: 'userone@example.com',
          firstname: null,
          groups: [],
          is_enrolled: true,
          last_directory_sync: null,
          last_login: null,
          lastname: null,
          notes: '',
          phones: [
            {
              activated: false,
              capabilities: ['sms'],
              encrypted: '',
              extension: '',
              fingerprint: '',
              last_seen: '',
              model: 'Unknown',
              name: "User's iPhone",
              number: '+15555555555',
              phone_id: 'DPTJY8KH6ESU14LQ5PAL',
              platform: 'Generic Smartphone',
              screenlock: '',
              sms_passcodes_sent: false,
              tampered: '',
              type: 'Mobile',
            },
          ],
          realname: 'User One',
          status: 'active',
          tokens: [
            {
              serial: '123abc',
              token_id: 'DH9K9HUHLNXCP2E4Z0O9',
              totp_step: null,
              type: 'h6',
            },
          ],
          u2ftokens: [],
          user_id: 'DUHBVLNGTNJFT6W6O5F0',
          username: 'userone',
          webauthncredentials: [],
        },
      ],
      stat: 'OK',
    });
  });
});
