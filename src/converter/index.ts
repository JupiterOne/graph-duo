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
        displayName: user.realname,
        createdOn: getTime(user.created),
        status: user.status,
        email: user.email,
        isEnrolled: user.is_enrolled,
        notes: user.notes,
      },
    },
  });
}
