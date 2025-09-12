/**
 * UpdateController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
      const { id, config, value, queues } = this.req.allParams();
      const data = await sails.helpers.job.modify({ id, config, value, queues });
      if (!data) {
        return exits.badRequest('Update job failed');
      }
      return exits.ok({
        ...data,
        message: 'Update job successfully'
      });
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'raw.code', error.code) || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'raw.message', error.message) || 'Unknown error';
      /** Log */
      sails.log.error(`[A][J][UJ]: ${message}.`);
      /** Return message */
      throw {
        badRequest: { message, code },
      };
    }
  }
};

