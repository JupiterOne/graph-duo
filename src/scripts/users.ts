import ServicesClient from '../collector/ServicesClient';

const [, , apiHostname, secretKey, integrationKey] = process.argv;

const client = new ServicesClient({ apiHostname, secretKey, integrationKey });

client.fetchUsers().then(console.log).catch(console.error);
