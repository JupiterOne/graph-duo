import fetch from 'node-fetch';

import { IntegrationError } from '@jupiterone/integration-sdk-core';

import buildAuthHeader from './buildAuthHeader';
import {
  DuoAccountSettings,
  DuoAdmin,
  DuoClientConfiguration,
  DuoGroup,
  DuoUser,
  Response,
  DuoPhone,
  DuoIntegration,
} from './types';

import * as moment from 'moment';

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

  private async fetch<T>(url: string): Promise<T> {
    const { integrationKey, secretKey } = this.config;

    const date = moment.utc().format(DATE_RFC2822);
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
      headers: {
        Authorization: `Basic ${authHeader}`,
        Date: date,
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new IntegrationError({
        code: String(response.status),
        message: response.statusText,
      });
    }
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

  async fetchPhones(): Promise<Response<DuoPhone[]>> {
    return this.fetch<Response<DuoPhone[]>>('phones');
  }

  async fetchIntegrations(): Promise<Response<DuoIntegration[]>> {
    return this.fetch<Response<DuoIntegration[]>>('integrations');
  }
}
