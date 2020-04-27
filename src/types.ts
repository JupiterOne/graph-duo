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

export interface User {
  alias1: string | null;
  alias2: string | null;
  alias3: string | null;
  alias4: string | null;
  created: number;
  desktoptokens: any[];
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
  tokens: any[];
  u2ftokens: any[];
  user_id: string;
  username: string;
  webauthncredentials: any[];
}
