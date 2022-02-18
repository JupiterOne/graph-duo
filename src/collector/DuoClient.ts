import fetch from 'node-fetch';

import { IntegrationError } from '@jupiterone/integration-sdk-core';

import buildAuthHeader from './buildAuthHeader';
import {
  DuoAccountSettings,
  DuoAdmin,
  DuoClientConfiguration,
  DuoGroup,
  DuoIntegration,
  DuoPhone,
  DuoUser,
  Response,
} from './types';

import * as moment from 'moment';

const DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

// Retry constants.  Pulled from example Python client from Duo at
// https://github.com/duosecurity/duo_client_python/blob/master/duo_client/client.py
const MAX_BACKOFF_WAIT_SECS = 32;
const INITIAL_BACKOFF_WAIT_SECS = 1;
const BACKOFF_FACTOR = 2;
const RATE_LIMITED_RESP_CODE = 429;

const DEFAULT_PAGE_SIZE = 100;

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

  async fetchWithRetry(
    url: string,
    attemptTimeout = INITIAL_BACKOFF_WAIT_SECS,
    offset?: number,
  ): Promise<any> {
    if (attemptTimeout > MAX_BACKOFF_WAIT_SECS) {
      throw new Error('Max API request retry attempts reached.');
    }

    const { integrationKey, secretKey } = this.config;

    const date = moment.utc().format(DATE_RFC2822);
    const path = `/admin/v1/${url}`;
    //Default limit size
    let params = `limit=${DEFAULT_PAGE_SIZE}`;
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
      const responseStatus = response.status;
      if (responseStatus === RATE_LIMITED_RESP_CODE) {
        // Rate limit exceeded
        await this.sleepBeforeRetry(attemptTimeout);
        return this.fetchWithRetry(
          url,
          attemptTimeout * BACKOFF_FACTOR,
          offset,
        );
      } else {
        throw new IntegrationError({
          code: String(response.status),
          message: response.statusText,
        });
      }
    }
  }

  private async sleepBeforeRetry(secondsToSleep: number) {
    const retryAfterMs = secondsToSleep * 1000;
    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
  }

  async fetchWithPagination<T>(
    url: string,
    pageIteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let offset: number | undefined = 0;

    while (offset != undefined) {
      const pageResponse = await this.fetchWithRetry(
        url,
        INITIAL_BACKOFF_WAIT_SECS,
        offset,
      );
      await pageIteratee(pageResponse);
      // Make sure we exit the while loop when missing a
      // valid response with valid metadata
      if (!pageResponse || !pageResponse.metadata) {
        offset = undefined;
      } else {
        offset = pageResponse.metadata.next_offset;
      }
    }
  }

  // No pagination available (or needed) for this call.
  async fetchAccountSettings(): Promise<Response<DuoAccountSettings>> {
    return await this.fetchWithRetry('settings');
  }

  async iterateAdmins(iteratee: ResourceIteratee<DuoAdmin>): Promise<void> {
    await this.fetchWithPagination<Response<DuoAdmin[]>>(
      'admins',
      async (response) => {
        const admins = response.response;
        for (const admin of admins) {
          await iteratee(admin);
        }
      },
    );
  }

  async iterateGroups(iteratee: ResourceIteratee<DuoGroup>): Promise<void> {
    await this.fetchWithPagination<Response<DuoGroup[]>>(
      'groups',
      async (response) => {
        const groups = response.response;
        for (const group of groups) {
          await iteratee(group);
        }
      },
    );
  }

  async iterateIntegrations(
    iteratee: ResourceIteratee<DuoIntegration>,
  ): Promise<void> {
    await this.fetchWithPagination<Response<DuoIntegration[]>>(
      'integrations',
      async (response) => {
        const integrations = response.response;
        for (const integration of integrations) {
          await iteratee(integration);
        }
      },
    );
  }

  async iteratePhones(iteratee: ResourceIteratee<DuoPhone>): Promise<void> {
    await this.fetchWithPagination<Response<DuoPhone[]>>(
      'phones',
      async (response) => {
        const phones = response.response;
        for (const phone of phones) {
          await iteratee(phone);
        }
      },
    );
  }

  async iterateUsers(iteratee: ResourceIteratee<DuoUser>): Promise<void> {
    await this.fetchWithPagination<Response<DuoUser[]>>(
      'users',
      async (response) => {
        const users = response.response;
        for (const user of users) {
          await iteratee(user);
        }
      },
    );
  }
}
