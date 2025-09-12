module.exports = {


  friendlyName: 'Push',


  description: 'Push notification.',


  inputs: {
    data: {
      type: 'ref',
      required: true,
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    // TODO
    const defaultInstance = _.get(global, `axios.telegram`, {});
    /** Get configurations */
    const telegramBaseUrl = _.get(sails.config.custom, 'notification.telegram.baseUrl', 'https://api.telegram.org/bot');
    /** Get data */
    const { queue, job, redisClient } = _.get(inputs, 'data', {});
    /** Get notification options */
    const jobData = await sails.helpers.redis.getDataKey({
      redisClient,
      queue,
      jobId: _.get(job, 'id', '')
    });
    const notificationOptions = _.get(job, 'data', jobData);
    const { chatId, message } = notificationOptions;

    if (!chatId || !message) {
      throw ({ code: `[H][N][P][ERR002]`, message: 'Missing required notification fields' });
    }

    try {
      await defaultInstance.post(`${telegramBaseUrl}${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }, { timeout: 10000 }).catch(() => {
        throw ({ code: `[H][N][P][ERR003]`, message: 'Failed to send notification' });
      });

      return exits.success({
        code: 0,
        status: 'success',
        log: {
          chatId: chatId,
        }
      });

    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][N][P]: ${message}`);
      throw ({
        code,
        message
      });
    }

  }


};
