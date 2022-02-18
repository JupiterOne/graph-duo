import { createStepContext } from '../../../test';
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

  const response = await provider.fetchWithRetry('settings');

  expect(response).toEqual({
    response: {
      enrollment_module: 'new',
      fraud_email: '',
      fraud_email_enabled: true,
      helpdesk_bypass: 'allow',
      helpdesk_bypass_expiration: 0,
      helpdesk_can_send_enroll_email: false,
      helpdesk_message: '',
      inactive_admin_expiration: 0,
      inactive_user_expiration: 0,
      instant_restore_enabled: 1,
      language: 'EN',
      lockout_expire_duration: null,
      lockout_threshold: 10,
      log_retention_days: null,
      minimum_password_length: 12,
      mobile_analytics_disabled: 0,
      mobile_otp_enabled: false,
      name: 'JupiterOne Inc',
      password_requires_lower_alpha: false,
      password_requires_numeric: false,
      password_requires_special: false,
      password_requires_upper_alpha: false,
      push_enabled: false,
      reactivation_integration_key: null,
      reactivation_url: '',
      req_fips_passcodes_android: false,
      security_checkup_enabled: 1,
      sms_batch: 1,
      sms_enabled: false,
      sms_expiration: 0,
      sms_message: 'SMS passcodes',
      sms_refresh: 0,
      telephony_warning_min: 0,
      timezone: 'UTC',
      user_telephony_cost_max: 20,
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

  const response = await provider.fetchWithRetry('users');

  expect(response).toEqual(
    expect.objectContaining({ metadata: { total_objects: 1 } }),
  );

  expect(response.response[0]).toEqual(
    expect.objectContaining({
      email: 'austin.kelleher+duotest@jupiterone.com',
      groups: [
        {
          desc: 'test group',
          group_id: 'DGYM32D735SEKRC8X7S5',
          mobile_otp_enabled: false,
          name: 'testJ1Group',
          push_enabled: false,
          sms_enabled: false,
          status: 'Bypass',
        },
      ],
      is_enrolled: true,
      last_directory_sync: null,
      last_login: null,
      lastname: null,
      notes: 'Hello notes!',
      realname: 'Austin Kelleher Test',
      status: 'active',
      user_id: 'DUNWSZS0P50553CA4FAH',
      username: 'austinkellehertest',
    }),
  );
});
