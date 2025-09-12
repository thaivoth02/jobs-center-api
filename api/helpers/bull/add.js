const Bull = require('bull');

module.exports = {


  friendlyName: 'Add',


  description: 'Add bull.',


  inputs: {
    data: {
      type: 'ref',
      required: true
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    // TODO
    /** Get configurations */
    const jobDefaultOptions = _.get(sails.config.custom, 'constants.job.options', {});
    try {
      const { queueName, queueConfig, job } = _.get(inputs, 'data', {});
      /** Create redis client */
      const redisClient = await sails.helpers.redis.createClient();
      /** Create bull instance */
      const queueInstance = new Bull(queueName, redisClient, queueConfig);
      /** Recheck if queue is paused */
      const isPaused = await queueInstance.isPaused() || false;
      if (isPaused) {
        await queueInstance.pause();
      }
      /** Add job */
      const jobConfig = _.get(job, 'config', {});
      const jobId = _.get(job, 'id', 'newJob');
      queueInstance.add({}, {
        ...jobConfig,
        ...jobDefaultOptions,
        jobId
      });
      await queueInstance.resume();
      return exits.success();
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][J][U]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

