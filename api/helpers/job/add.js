module.exports = {


  friendlyName: 'Create queue',


  description: '',


  inputs: {
    data: {
      type: 'ref',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    try {
      const { config, status, queues, value } = _.get(inputs, 'data');
      let createParams = {
        id: 'newJob',
      };
      let queueRecord = [];
      if (_.isEmpty(queues)) {
        throw ({ code: `[H][J][C][ERR001]`, message: 'A queue is required' });
      } else {
        const queuePromises = queues.map(async (queue) => {
          try {
            const findQueue = await Queue.findOne({ code: queue });
            if (!findQueue) {
              throw { code: '[H][J][C][ERR002]', message: 'Queue not found' };
            }
            const queueName = _.get(findQueue, 'name', '') || '';
            const queueConfig = _.get(findQueue, 'config', {});
            // Create log
            queueRecord.push({
              queueConfig,
              queueName,
            });
          } catch (error) {
            const message = _.get(error, 'message', 'Unknown error');
            sails.log.error(`[H][J][C]: ${message}`);
          }
        });
        await Promise.all(queuePromises);
      }
      if (_.isEmpty(queueRecord)) {
        throw { code: '[H][J][C][ERR003]', message: 'Queue not found' };
      }
      if (config) {
        let convertedConfig = config;
        const repeat = _.get(config, 'repeat', {});
        if (repeat) {
          convertedConfig = _.omit(config, 'repeat');
          const cronTime = await sails.helpers.util.convertCronTime(config);
          convertedConfig = {
            ...convertedConfig,
            repeat: {
              cron: cronTime
            }
          };
        }
        createParams = {
          ...createParams,
          config: convertedConfig
        };
      }
      if (status) {
        createParams = {
          ...createParams,
          status
        };
      }
      if (value) {
        createParams = {
          ...createParams,
          value
        };
      }
      /** Create job */
      const createJob = await Job.create(createParams).fetch();
      /** Get job id */
      queueRecord.forEach(async (queue) => {
        try {
          const queueName = _.get(queue, 'queueName', '');
          const queueConfig = _.get(queue, 'queueConfig', {});
          await sails.helpers.bull.add({ queueName, queueConfig, job: createJob });
        } catch (error) {
          sails.log.error(error);
        }
      });
      return exits.success(createJob);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][J][C]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

