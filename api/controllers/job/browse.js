
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
      const { id, status, queue } = this.req.allParams();
      const data = await sails.helpers.job.browse({ id, status, queue });
      return exits.ok({
        data,
        message: 'Get list job successful'
      });
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'raw.code', error.code) || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'raw.message', error.message) || 'Unknown error';
      /** Log */
      sails.log.error(`[A][J][LT]: ${message}.`);
      /** Return message */
      throw {
        badRequest: { message, code },
      };
    }
  }

};

