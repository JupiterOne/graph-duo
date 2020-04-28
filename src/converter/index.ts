import { User } from '../types';
import { createIntegrationEntity, getTime } from '@jupiterone/integration-sdk';

export function convertUser(
  user: User,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: `duo-user:${user.user_id}`,
        _type: 'duo_user',
        _class: 'User',
        id: user.user_id,
        name: user.realname,
        firstName: user.firstname,
        lastName: user.lastname,
        displayName: user.realname,
        username: user.username,
        createdOn: getTime(user.created),
        lastLogin: getTime(user.last_login),
        active: user.status === 'active',
        status: user.status,
        email: user.email,
        mfaEnabled: user.is_enrolled,
        notes: user.notes,
      },
    },
  });
}
