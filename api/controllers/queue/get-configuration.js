module.exports = {
  friendlyName: 'List configuration',

  description: 'List configuration',

  inputs: {},

  exits: {
    ok: {
      description: 'OK',
      responseType: 'ok'
    },
    badRequest: {
      description: 'Bad Request',
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      const data = await sails.helpers.queue.getConfiguration({});
      return exits.ok({
        ...data,
        message: 'List configuration successfully'
      });
    } catch (error) {
      /** Prepare to warn message */
      const code = _.get(error, 'code') || 'G_ERROR';
      const message = _.get(error, 'message') || 'System error';
      sails.log.error(`[C][Q][LC][ERROR] ${message}.`);
      throw {
        badRequest: { message, code }
      };
    }
  }
};
