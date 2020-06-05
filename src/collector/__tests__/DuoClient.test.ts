import { createStepContext } from 'test';

/* eslint-disable @typescript-eslint/camelcase */
import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';

import { createDuoClient } from '../';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetchSettings okay', async () => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetchSettings',
  });

  const context = createStepContext();
  const provider = createDuoClient(context.instance.config);

  const response = await provider.fetchAccountSettings();

  expect(response).toEqual({
    response: {
      android_min_version: 'all',
      blackberry_min_version: 'all',
      enrollment_module: 'new',
      fraud_email: '',
      fraud_email_enabled: true,
      helpdesk_bypass: 'allow',
      helpdesk_bypass_expiration: 0,
      helpdesk_message: '',
      inactive_admin_expiration: 0,
      inactive_user_expiration: 0,
      instant_restore_enabled: 1,
      ios_min_version: 'all',
      language: 'EN',
      lockout_expire_duration: null,
      lockout_threshold: 10,
      log_retention_days: null,
      minimum_password_length: 12,
      mobile_analytics_disabled: 0,
      mobile_otp_enabled: true,
      name: 'LifeOmic',
      password_requires_lower_alpha: false,
      password_requires_numeric: false,
      password_requires_special: false,
      password_requires_upper_alpha: false,
      push_enabled: true,
      reactivation_integration_key: null,
      reactivation_url: '',
      req_fips_passcodes_android: false,
      security_checkup_enabled: 1,
      sms_batch: 1,
      sms_enabled: true,
      sms_expiration: 0,
      sms_message: 'SMS passcodes',
      sms_refresh: 0,
      telephony_warning_min: 0,
      timezone: 'UTC',
      user_telephony_cost_max: 20,
      windows_phone_min_version: 'all',
    },
    stat: 'OK',
  });
});

test('fetchUsers okay', async () => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetchUsers',
  });

  const context = createStepContext();
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
