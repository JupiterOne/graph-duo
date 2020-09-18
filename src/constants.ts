import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const Entities = {
  ACCOUNT: {
    _type: 'duo_account',
    _class: 'Account',
    resourceName: 'Account',
  },
  USER: {
    _type: 'duo_user',
    _class: 'User',
    resourceName: 'User',
  },
  USER_GROUP: {
    _type: 'duo_group',
    _class: 'UserGroup',
    resourceName: 'Group',
  },
  ADMIN: {
    _type: 'duo_admin',
    _class: 'User',
    resourceName: 'Admin',
  },
  MFA_DEVICE: {
    _type: 'mfa_device',
    _class: 'AccessKey',
    resourceName: 'MFA Token',
  },
};

export const Relationships = {
  ACCOUNT_HAS_GROUP: {
    _type: 'duo_account_has_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER_GROUP._type,
  },
  ACCOUNT_HAS_ADMIN: {
    _type: 'duo_account_has_admin',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ADMIN._type,
  },
  ACCOUNT_HAS_USER: {
    _type: 'duo_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  GROUP_HAS_USER: {
    _type: 'duo_group_has_user',
    sourceType: Entities.USER_GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  USER_ASSIGNED_DEVICE: {
    _type: 'duo_user_assigned_device',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: Entities.MFA_DEVICE._type,
  },
};
