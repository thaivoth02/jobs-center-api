
module.exports = {

  exits: {
    ok: {
      responseType: 'ok',
      description: 'The request was successful.'
    },
    badRequest: {
      responseType: 'badRequest',
      description: 'The request was failed.'
    },
  },

  fn: async function (unused, exits) {
    try {
      const { config, status, queues, value } = this.req.allParams();
      const data = await sails.helpers.job.add({ config, status, queues, value });
      if (!data) {
        return exits.badRequest('Create job failed');
      }
      return exits.ok({
        ...data,
        message: 'Create job successful'
      });
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'raw.code', error.code) || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'raw.message', error.message) || 'Unknown error';
      /** Log */
      sails.log.error(`[A][J][CT]: ${message}.`);
      /** Return message */
      throw {
        badRequest: { message, code },
      };
    }
  }

};

