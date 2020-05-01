import fetch from 'node-fetch';
import buildAuthHeader from './buildAuthHeader';
import {
  Response,
  DuoUser,
  DuoAccountSettings,
  DuoAdmin,
  DuoGroup,
  DuoClientConfiguration,
} from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');

const DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

export default class DuoClient {
  readonly config: DuoClientConfiguration;
  readonly siteId: string;
  readonly hostname: string;

  constructor(config: DuoClientConfiguration, siteId: string) {
    this.config = config;
    this.siteId = siteId;
    this.hostname = config.apiHostname
      .toLowerCase()
      .replace(/^https?:\/\//, '');
  }

  private async fetch<T = any>(url: string): Promise<T> {
    const { integrationKey, secretKey } = this.config;

    const date = moment.utc().format(DATE_RFC2822).replace('+', '-');
    const path = `/admin/v1/${url}`;

    const authHeader = buildAuthHeader({
      date,
      method: 'GET',
      host: this.hostname,
      path,
      params: '',
      integrationKey,
      secretKey,
    });

    const response = await fetch(`https://${this.hostname}${path}`, {
      headers: new fetch.Headers({
        Authorization: `Basic ${authHeader}`,
        Date: date,
      }),
    });

    return response.json();
  }

  async fetchAccountSettings(): Promise<Response<DuoAccountSettings>> {
    return this.fetch<Response<DuoAccountSettings>>('settings');
  }

  async fetchGroups(): Promise<Response<DuoGroup[]>> {
    return this.fetch<Response<DuoGroup[]>>('groups');
  }

  async fetchUsers(): Promise<Response<DuoUser[]>> {
    return this.fetch<Response<DuoUser[]>>('users');
  }

  async fetchAdmins(): Promise<Response<DuoAdmin[]>> {
    return this.fetch<Response<DuoAdmin[]>>('admins');
  }
}
