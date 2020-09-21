import {
  DuoUser,
  DuoU2fToken,
  DuoWebAuthnCredential,
  DuoToken,
  DuoAccountSettings,
  DuoGroup,
  DuoAdmin,
  DuoPhone,
  DuoIntegration,
} from '../collector/types';
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function convertAccount(
  siteId: string,
  data: DuoAccountSettings,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: `duo-account:${siteId}:${data.name
          .toLowerCase()
          .replace(/\s/, '-')}`,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: data.name,
        siteId,
        displayName: `${data.name} Duo Account`,
        webLink: `https://admin-${siteId}.duosecurity.com/`,
      },
    },
  });
}

export function convertUser(
  user: DuoUser,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: `duo-user:${user.user_id}`,
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        id: user.user_id,
        name: user.realname,
        firstName: user.firstname,
        lastName: user.lastname,
        displayName: user.realname as string,
        username: user.username,
        createdOn: getTime(user.created),
        lastLogin: getTime(user.last_login as number),
        active: user.status.toLowerCase() === 'active',
        status: user.status,
        email: user.email,
        mfaEnabled: user.is_enrolled,
        notes: typeof user.notes === 'string' ? [user.notes] : user.notes,
      },
    },
  });
}

export function convertGroup(
  group: DuoGroup,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: group,
      assign: {
        ...convertProperties(group),
        _key: `duo-group:${group.group_id}`,
        _type: Entities.USER_GROUP._type,
        _class: Entities.USER_GROUP._class,
        id: group.group_id,
        description: group.desc,
        active: group.status.toLowerCase() === 'active',
      },
    },
  });
}

export function convertAdmin(
  admin: DuoAdmin,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: admin,
      assign: {
        ...convertProperties(admin),
        _key: `duo-admin:${admin.admin_id}`,
        _type: Entities.ADMIN._type,
        _class: Entities.ADMIN._class,
        id: admin.admin_id,
        active: admin.status.toLowerCase() === 'active',
        admin: true,
        status: admin.status.toLowerCase(),
        username: admin.email,
      },
    },
  });
}

export function convertToken(
  token: DuoToken,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: token,
      assign: {
        _key: `mfa-device:${token.token_id}`,
        _type: Entities.MFA_DEVICE._type,
        _class: Entities.MFA_DEVICE._class,
        id: token.token_id,
        name: token.token_id || 'name',
        displayName: token.token_id || 'name',
        serial: token.serial,
        type: token.type,
        factorType: 'token',
      },
    },
  });
}

export function convertU2fToken(
  token: DuoU2fToken,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: token,
      assign: {
        _key: `mfa-device:${token.registration_id}`,
        _type: Entities.MFA_DEVICE._type,
        _class: Entities.MFA_DEVICE._class,
        id: token.registration_id,
        name: token.registration_id || 'name',
        displayName: token.registration_id || 'name',
        createdOn: getTime(token.date_added),
        factorType: 'u2f',
      },
    },
  });
}

export function convertWebAuthnToken(
  token: DuoWebAuthnCredential,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: token,
      assign: {
        _key: `mfa-device:${token.webauthnkey}`,
        _type: Entities.MFA_DEVICE._type,
        _class: Entities.MFA_DEVICE._class,
        id: token.webauthnkey,
        name: token.credential_name || 'name',
        displayName: `${token.credential_name} ${token.webauthnkey}`,
        createdOn: getTime(token.date_added),
        factorType: 'webauthn',
      },
    },
  });
}

/**
 * Devices must validate the data-model property `platform`
 */
function getPlatform(duoPlatform: string): string {
  const dataModelPlatforms = [
    'darwin',
    'linux',
    'unix',
    'windows',
    'android',
    'ios',
    'embedded',
  ];
  for (const dataModelPlatform of dataModelPlatforms) {
    if (new RegExp(dataModelPlatform, 'i').test(duoPlatform)) {
      return dataModelPlatform;
    }
  }
  return 'other';
}

export function convertPhone(
  phone: DuoPhone,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: phone,
      assign: {
        _key: phone.phone_id,
        _type: Entities.PHONE._type,
        _class: Entities.PHONE._class,
        id: phone.phone_id,
        name: phone.name,
        category: 'mobile',
        make: 'UNKNOWN',
        platform: getPlatform(phone.platform),
        model: phone.model,
        encrypted: phone.encrypted === 'Encrypted',
        serial: 'UNKNOWN',
      },
    },
  });
}

export function convertIntegration(
  integration: DuoIntegration,
): ReturnType<typeof createIntegrationEntity> {
  (integration as any).secret_key = undefined;
  const notes = integration.notes;
  return createIntegrationEntity({
    entityData: {
      source: integration,
      assign: {
        _key: integration.integration_key,
        _type: Entities.INTEGRATION._type,
        _class: Entities.INTEGRATION._class,
        id: integration.integration_key,
        name: integration.name,
        notes:
          notes !== undefined && notes !== null && !Array.isArray(notes)
            ? [notes]
            : notes,
      },
    },
  });
}
