import fetch from 'node-fetch';

import {
  IntegrationError,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';

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

// Retry constants.  Pulled from example Python client from Duo at
// https://github.com/duosecurity/duo_client_python/blob/master/duo_client/client.py
const MAX_BACKOFF_WAIT_SECS = 32;
const INITIAL_BACKOFF_WAIT_SECS = 1;
const BACKOFF_FACTOR = 2;
const RATE_LIMITED_RESP_CODE = 429;

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

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

  private async fetch<T>(url: string, offset?: number): Promise<T> {
    const { integrationKey, secretKey } = this.config;

    const date = moment.utc().format(DATE_RFC2822);
    const path = `/admin/v1/${url}`;
    //Default limit size
    let params = 'limit=1';
    if (offset) {
      params += `&offset=${offset}`;
    }

    const authHeader = buildAuthHeader({
      date,
      method: 'GET',
      host: this.hostname,
      path,
      params,
      integrationKey,
      secretKey,
    });

    const response = await fetch(`https://${this.hostname}${path}?${params}`, {
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

  private async fetchWithRetry(
    url: string,
    attemptTimeout = INITIAL_BACKOFF_WAIT_SECS,
    offset?: number,
  ): Promise<any> {
    if (attemptTimeout > MAX_BACKOFF_WAIT_SECS) {
      throw new Error('Max API request retry attempts reached.');
    }
    try {
      const { integrationKey, secretKey } = this.config;

      const date = moment.utc().format(DATE_RFC2822);
      const path = `/admin/v1/${url}`;
      //Default limit size
      let params = 'limit=1';
      if (offset) {
        params += `&offset=${offset}`;
      }

      const authHeader = buildAuthHeader({
        date,
        method: 'GET',
        host: this.hostname,
        path,
        params,
        integrationKey,
        secretKey,
      });

      const response = await fetch(
        `https://${this.hostname}${path}?${params}`,
        {
          headers: {
            Authorization: `Basic ${authHeader}`,
            Date: date,
          },
        },
      );

      if (response.ok) {
        return response.json();
      } else {
        const responseStatus = response.status;
        if (responseStatus === RATE_LIMITED_RESP_CODE) {
          // Rate limit exceeded
          const retryAfterMs = attemptTimeout * 1000 + 3000;
          await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
          return this.fetchWithRetry(
            url,
            attemptTimeout * BACKOFF_FACTOR,
            offset,
          );
        }
      }
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: url,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  async fetchWithPagination<T>(
    url: string,
    pageIteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let offset = 0;

    while (offset != undefined) {
      const pageResponse = await this.fetchWithRetry(
        url,
        INITIAL_BACKOFF_WAIT_SECS,
        offset,
      );
      await pageIteratee(pageResponse);
      offset = pageResponse.metadata.next_offset;
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
