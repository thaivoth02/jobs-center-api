module.exports = (sails) => {
  const axios = require('axios');
  const { createClient } = require('redis');
  const { buildStorage, setupCache } = require('axios-cache-interceptor');
  let conf;
  /** Get exclude methods */
  const methods = _.get(sails.config.custom, `cache.methods`, []);
  /** Get prefix  */
  const prefix = _.get(sails.config.custom, `cache.prefix`, `jobsCenterCached`);
  /** Setup redis client */
  const client = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    },
  });
  /** Listen error event */
  client.on(`error`, (error) => sails.log.error(`Redis Client Error: ${error.message}`));
  /** Connect redis client */
  client.connect();
  /** Customize storage */
  const redisStorage = buildStorage({
    async find(key) {
      const result = await client.get(`${prefix}:${key}`);
      return JSON.parse(result);
    },

    async set(key, value) {
      await client.set(`${prefix}:${key}`, JSON.stringify(value));
    },

    async remove(key) {
      await client.del(`${prefix}:${key}`);
    },
  });
  return {
    defaults: {
      __configKey__: {
        customModelGlobal: 'axios',
        clsNamespace: 'axios',
        exposeToGlobal: true,
      },
    },
    configure() {
      this.configKey = 'axios';
      conf = sails.config[this.configKey];
      /** Log info about axios */
      sails.log.info('Exposing Axios globally');
      let prefix = conf.customModelGlobal || 'axios';
      global[prefix] = {};
      for (let endpoint of conf.endpoints) {
        let config = {
          baseURL: endpoint.baseUrl,
          timeout: endpoint.timeout || 10000,
          headers: endpoint.headers || {},
        };
        if (
          endpoint.authentication &&
          endpoint.authentication.type === 'bearer'
        ) {
          config.headers.Authorization = `Bearer ${endpoint.authentication.token}`;
        }
        if (
          endpoint.authentication &&
          endpoint.authentication.type === 'basic'
        ) {
          config.auth = {
            username: endpoint.authentication.username,
            password: endpoint.authentication.password,
          };
        }
        if (endpoint.cache && endpoint.cache.maxAge > 0) {
          /** Setup api instances */
          const api = setupCache(
            axios.create({
              ...config,
              transformResponse: (x) => x,
            }),
            {
              methods,
              ttl: endpoint.cache.maxAge,
              storage: redisStorage,
            }
          );
          /** Binding cache to current axios */
          global[prefix][endpoint.name] = api;
        } else {
          /** Setup normal axios instance */
          global[prefix][endpoint.name] = axios.create(config);
        }
      }
    },
    initialize(next) {
      next();
    },
  };
};
