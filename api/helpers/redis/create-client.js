const redis = require('redis');

module.exports = {


  friendlyName: 'Create client',


  description: '',


  inputs: {
    data: {
      type: 'ref',
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    // TODO
    try {
      const { username = ``, password = ``, host = 'localhost', port = 6379, database = `` } = _.get(inputs, 'data', {});
      const redisClient = redis.createClient({
        socket: {
          host,
          port,
        },
        username,
        password,
        database,
      });
      redisClient.on('error', (error) => {
        sails.log.error('Redis client error:', error);
      });
      return exits.success(redisClient);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][REDIS][CL]: ${message}`);
      throw ({
        code,
        message
      });

    }
  }


};

