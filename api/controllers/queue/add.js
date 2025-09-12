
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
      const { name, code, status, config, job, supplier } = this.req.allParams();
      const data = await sails.helpers.queue.add({ name, code, status, config, job, supplier });
      if (!data) {
        return exits.badRequest('Create queue failed');
      }
      return exits.ok({
        ...data,
        message: 'Create queue successful'
      });
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'raw.code', error.code) || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'raw.message', error.message) || 'Unknown error';
      /** Log */
      sails.log.error(`[A][Q][CQ]: ${message}.`);
      /** Return message */
      throw {
        badRequest: { message, code },
      };
    }
  }

};

