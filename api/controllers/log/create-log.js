module.exports = {
  friendlyName: 'Create log',

  description: 'Create log',

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
    const code = this.req.param('code', '') || '';
    const log = this.req.param('log', '') || '';
    const jobId = this.req.param('jobId', '') || '';
    const queueId = this.req.param('queueId', '') || '';
    try {
      const data = await sails.helpers.log.createLog({ code, log, jobId, queueId });
      return exits.ok({
        ...data,
        message: 'Create log successfull'
      });
    } catch (error) {
      /** Prepare to warn message */
      const code = _.get(error, 'raw.code') || 'G_ERROR';
      const message = _.get(error, 'raw.message') || 'System error';
      sails.log.error(`[C][C][C][ERROR] ${message}.`);
      throw {
        badRequest: { message, code }
      };
    }
  }
};
