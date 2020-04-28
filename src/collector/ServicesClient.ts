import fetch from 'node-fetch';
import {
  Response,
  DuoUser,
  DuoAccountSettings,
  DuoAdmin,
  DuoGroup,
} from '../types';

const moment = require('moment');
const base64 = require('base-64');
const crypto = require('crypto');

const DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

interface ServicesClientConfiguration {
  apiHostname: string;
  integrationKey: string;
  secretKey: string;
}

export default class ServicesClient {
  readonly config: ServicesClientConfiguration;

  constructor(config: ServicesClientConfiguration) {
    this.config = config;
  }

  private async fetch<T = any>(url: string): Promise<T> {
    const { apiHostname, integrationKey, secretKey } = this.config;

    const date = moment.utc().format(DATE_RFC2822).replace('+', '-');
    const method = 'GET';
    const host = apiHostname.toLowerCase().replace(/^https?:\/\//, '');
    const path = `/admin/v1/${url}`;
    const params = '';

    const lines = [date, method, host, path, params].join('\n');

    const h = crypto.createHmac('sha1', secretKey);
    h.update(lines);
    const signature = h.digest('hex');

    const response = await fetch(`https://${apiHostname}${path}`, {
      headers: new fetch.Headers({
        Authorization: `Basic ${base64.encode(
          `${integrationKey}:${signature}`,
        )}`,
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
