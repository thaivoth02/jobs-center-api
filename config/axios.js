module.exports.axios = {
  customModelGlobal: 'axios',
  endpoints: [
    {
      name: 'default',
      timeout: 30000,
      headers: {},
      authentication: {
        type: 'bearer',
        token: 'xxxx',
      },
    },
    {
      name: 'telegram',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ],
};
