import buildAuthHeader from '../buildAuthHeader';
import { testConfig } from './constants';

test('applies the appropriate headers', () => {
  expect(
    buildAuthHeader({
      date: 'Tue, 21 Aug 2012 17:29:18 -0000',
      method: 'POST',
      host: 'api-xxxxxxxx.duosecurity.com',
      path: '/admin/v1/users',
      params: 'realname=First%20Last&username=root',
      integrationKey: testConfig.integrationKey,
      secretKey: testConfig.secretKey,
    }),
  ).toEqual(
    'RElXSjhYNkFFWU9SNU9NQzZUUTE6YzFlZjQzNzY3YzNlYjNiMzI1OGRiZGRjYTZmOGQwOTQxZTA4NWI5Mg==',
  );
});
