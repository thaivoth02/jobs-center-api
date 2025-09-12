const { Resend } = require('resend');

module.exports = {


  friendlyName: 'Send',


  description: 'Send email.',


  inputs: {
    data: {
      type: 'ref',
      description: 'The data object containing helperData, queue, and job.',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    // TODO
    const resend = new Resend(process.env.RESEND_API_KEY);
    /** Get configurations */
    const resendDefaultEmail = _.get(sails.config.custom, 'email.defaultEmail', 'onboarding@resend.dev');
    /** Get data */
    const { queue, job, redisClient } = _.get(inputs, 'data', {});
    /** Get email options */
    const jobData = await sails.helpers.redis.getDataKey({
      redisClient,
      queue,
      jobId: _.get(job, 'id', '')
    });
    const emailOptions = _.get(job, 'data', jobData);
    const { from = resendDefaultEmail, to, subject, html } = emailOptions;

    if (!to || !subject || !html) {
      throw ({ code: `[H][E][S][ERR002]`, message: 'Missing required email fields' });
    }

    try {
      resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      return exits.success({
        code: 0,
        message: 'success',
        log: {
          from,
          to,
        }
      });

    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][E][S]: ${message}`);
      throw ({
        code,
        message
      });
    }

  }


};

