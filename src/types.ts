export interface Response<T> {
  metadata: {
    [key: string]: string;
  };
  response: T;
  stat: 'OK' | 'FAIL';
  code?: number;
  message?: string;
  message_detail?: string | null;
}

export interface DuoAccountSettings {
  caller_id?: string;
  fraud_email?: string;
  fraud_email_enabled?: true;
  helpdesk_bypass?: string;
  helpdesk_bypass_expiration?: number;
  inactive_user_expiration?: number;
  keypress_confirm?: string;
  keypress_fraud?: string;
  language?: string;
  lockout_expire_duration?: number | null;
  lockout_threshold?: number;
  log_retention_days?: number | null;
  minimum_password_length?: number;
  mobile_otp_enabled?: boolean;
  name: string;
  password_requires_lower_alpha?: boolean;
  password_requires_numeric?: boolean;
  password_requires_special?: boolean;
  password_requires_upper_alpha?: boolean;
  push_enabled?: boolean;
  req_fips_passcodes_android?: boolean;
  security_checkup_enabled?: 0 | 1 | boolean;
  sms_batch?: number;
  sms_enabled?: boolean;
  sms_expiration?: number;
  sms_message?: string;
  sms_refresh?: number;
  telephony_warning_min?: number;
  timezone?: string;
  user_telephony_cost_max?: number;
  voice_enabled?: boolean;
}

export interface DuoToken {
  serial: string;
  token_id: string;
  type: string;
}

export interface DuoU2fToken {
  date_added: string;
  registration_id: string;
}

export interface DuoWebAuthnCredential {
  credential_name: string;
  date_added: number;
  label: string;
  webauthnkey: string;
}

export interface DuoUser {
  alias1: string | null;
  alias2: string | null;
  alias3: string | null;
  alias4: string | null;
  created: number;
  desktoptokens?: any[];
  email: string | null;
  firstname: string | null;
  groups: any[];
  is_enrolled: boolean;
  last_directory_sync: number | null;
  last_login: number | null;
  lastname: string | null;
  notes: string | null;
  phones: any[];
  realname: string | null;
  status: string;
  tokens?: DuoToken[];
  u2ftokens?: DuoU2fToken[];
  user_id: string;
  username: string;
  webauthncredentials: DuoWebAuthnCredential[];
}

export interface DuoGroup {
  desc: string;
  group_id: string;
  mobile_otp_enabled: boolean;
  name: string;
  push_enabled: boolean;
  sms_enabled: boolean;
  status: string;
  voice_enabled: boolean;
}

export interface DuoAdmin {
  admin_id: string;
  email: string;
  last_login: number;
  name: string;
  password_change_required: boolean;
  phone: string;
  restricted_by_admin_units: boolean;
  role: string;
  status: string;
}
