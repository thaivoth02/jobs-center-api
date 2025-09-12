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
      const { id, name, status, config, job, supplier } = this.req.allParams();
      const data = await sails.helpers.queue.modify({ id, name, status, config, job, supplier });
      if (!data) {
        return exits.badRequest('Update queue failed');
      }
      return exits.ok({
        ...data,
        message: 'Update queue successfully'
      });
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'raw.code', error.code) || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'raw.message', error.message) || 'Unknown error';
      /** Log */
      sails.log.error(`[A][Q][UQ]: ${message}.`);
      /** Return message */
      throw {
        badRequest: { message, code },
      };

    }
  }
};

