This integration requires a Duo account with Admin API access. Follow the instructions at https://duo.com/docs/adminapi to obtain Admin API access for your account.

Once you've obtained Admin API access and have located your API hostname, integration key, and secret key, you can test the `/users` endpoint using the following command:

`ts-node src/collector/index.ts <API hostname> <secret key> <integration key>`
