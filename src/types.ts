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

export interface Token {
  serial: string;
  token_id: string;
  type: string;
}

export interface U2fToken {
  date_added: string;
  registration_id: string;
}

export interface WebAuthnCredential {
  credential_name: string;
  date_added: number;
  label: string;
  webauthnkey: string;
}

export interface User {
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
  tokens?: Token[];
  u2ftokens?: U2fToken[];
  user_id: string;
  username: string;
  webauthncredentials: WebAuthnCredential[];
}
