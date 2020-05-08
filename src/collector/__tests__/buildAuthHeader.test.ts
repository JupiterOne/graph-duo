import buildAuthHeader from '../buildAuthHeader';

test('applies the appropriate headers', () => {
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
