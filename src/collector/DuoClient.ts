import fetch from 'node-fetch';
import {
  Response,
  DuoUser,
  DuoAccountSettings,
  DuoAdmin,
  DuoGroup,
  DuoClientConfiguration,
} from './types';

const moment = require('moment');
const base64 = require('base-64');
const crypto = require('crypto');

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
    const { apiHostname, integrationKey, secretKey } = this.config;

    const date = moment.utc().format(DATE_RFC2822).replace('+', '-');
    const path = `/admin/v1/${url}`;

    const authHeader = this.buildAuthHeader({
      date,
      method: 'GET',
      host: this.hostname,
      path,
      params: '',
      integrationKey,
      secretKey,
    });

    const response = await fetch(`https://${apiHostname}${path}`, {
      headers: new fetch.Headers({
        Authorization: `Basic ${authHeader}`,
        Date: date,
      }),
    });

    return response.json();
  }

  buildAuthHeader({
    date,
    method,
    host,
    path,
    params,
    integrationKey,
    secretKey,
  }) {
    const lines = [date, method, host, path, params].join('\n');
    const h = crypto.createHmac('sha1', secretKey);
    h.update(lines);
    const signature = h.digest('hex');
    return base64.encode(`${integrationKey}:${signature}`);
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
