const shortHash = require('short-hash');
const uuid = require('uuid');
module.exports = {


  friendlyName: 'Create log',


  description: '',


  inputs: {
    data: {
      type: 'ref',
      required: true,
    },
  },


  exits: {

    success: {
      outputFriendlyName: 'Create log',
    },

  },


  fn: async function (inputs, exits) {
    // TODO
    //Get configuration warehouse
    const { code = '', log = '', queueId = '', jobId = '', redisClient } = _.get(inputs, 'data', {});
    const id = 'createLog';
    try {
      if (code === '') {
        throw ({ code: `[H][L][CL][ERR001] `, message: `code is requried` });
      }

      if (queueId === '') {
        throw ({ code: `[H][L][CL][ERR002] `, message: `queueId is requried` });
      }
      const findQueue = await Queue.findOne({ id: queueId });
      if (!findQueue) {
        throw ({ code: `[H][L][CL][ERR003] `, message: `Not found queue` });
      }

      if (jobId === '') {
        throw ({ code: `[H][L][CL][ERR004] `, message: `jobId is requried` });
      }
      const jobData = await sails.helpers.redis.getDataKey({
        redisClient,
        queue: findQueue,
        jobId
      });
      const findJob = await Job.findOne({ id: jobId });
      if (!findJob && _.isEmpty(jobData)) {
        throw ({ code: `[H][L][CL][ERR005] `, message: `Not found job` });
      }

      const findLog = await Log.findOne({ code });
      if (findLog) {
        throw ({ code: `[H][L][CL][ERR006] `, message: `code is exist` });
      }
      let newData = {
        id,
        code: `${code} | ${shortHash(uuid.v4())}`,
        job: findJob ? jobId : `${jobId} - Manual`,
        queue: queueId
      };
      if (log !== '') {
        newData = {
          ...newData,
          log
        };
      }
      const createLog = await Log.create(newData).fetch();
      return exits.success({
        data: createLog,
        message: 'Create log successfull'
      });
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][L][CL]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }
};

