import buildAuthHeader, { buildAuthDigest } from '../buildAuthHeader';

test('buildAuthHeader encodes integrationKey:digest', () => {
  expect(
    // Using sample data from https://duo.com/docs/adminapi#authentication
    buildAuthHeader({
      date: 'Tue, 21 Aug 2012 17:29:18 -0000',
      method: 'POST',
      host: 'api-xxxxxxxx.duosecurity.com',
      path: '/admin/v1/users',
      params: 'realname=First%20Last&username=root',
      integrationKey: 'DIWJ8X6AEYOR5OMC6TQ1',
      secretKey: 'Zh5eGmUq9zpfQnyUIu5OL9iWoMMv5ZNmk3zLJ4Ep',
    }),
  ).toEqual(
    'RElXSjhYNkFFWU9SNU9NQzZUUTE6YzFlZjQzNzY3YzNlYjNiMzI1OGRiZGRjYTZmOGQwOTQxZTA4NWI5Mg==',
  );
});

test('buildAuthDigest generates value known to authorize', () => {
  expect(
    buildAuthDigest({
      date: 'Mon, 11 May 2020 18:07:52 +0000',
      method: 'GET',
      host: 'api-xxx.duosecurity.com',
      path: '/admin/v1/settings',
      params: '',
      integrationKey: 'DIFIAAAAAAAAAA',
      secretKey: 'topsecret123',
    }),
  ).toEqual('6a5f2e04a1392e0d540283e8bced5ea93b12ecea');
});
