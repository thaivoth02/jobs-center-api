/**
 * DownloadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  exits: {
    success: {
      description: 'The request was successful.'
    },
    badRequest: {
      responseType: 'badRequest',
      description: 'The request was failed.'
    },
  },

  fn: async function (unused, exits) {
    try {
      const file = this.req.param(`fileName`, '');
      if (!file) {
        return exits.badRequest('File not found');
      }
      const data = await sails.helpers.file.downloadFile({ file });
      return exits.success(data);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'raw.code', error.code) || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'raw.message', error.message) || 'Unknown error';
      /** Log */
      sails.log.error(`[A][F][DF]: ${message}.`);
      /** Return message */
      throw {
        badRequest: { message, code },
      };
    }
  }

};

