module.exports = {


  friendlyName: 'Get data key',


  description: '',


  inputs: {
    data: {
      type: 'ref',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Data key',
    },

  },


  fn: async function (inputs, exits) {
    // TODO

    const { redisClient, queue, jobId } = _.get(inputs, 'data', {});

    if (jobId === '') {
      throw ({ code: `[H][R][GDK][ERR001]`, message: 'Job ID is required' });
    }

    const queueName = _.get(queue, 'name', '');
    const key = `bull:${queueName}:${jobId}`;
    let jobData = {};
    const keyType = await redisClient.type(key);

    try {
      if (keyType === 'hash') {
        jobData = await redisClient.hget(key, 'data');
      } else if (keyType === 'string') {
        jobData = await redisClient.get(key);
      }
      return exits.success(jobData);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'G_ERROR';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][R][GDK]: ${message}`);
      throw ({ code, message });
    }
  }


};

