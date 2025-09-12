const Bull = require('bull');

module.exports = {


  friendlyName: 'Update',


  description: 'Update queue.',


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
    // TODO
    try {
      /** Create redis client */
      const redisClient = await sails.helpers.redis.createClient();
      /** Get data */
      const { id, name, status, config, job, supplier } = _.get(inputs, 'data');
      if (!id) {
        throw ({ code: `[H][Q][U][ERR001]`, message: 'Id is required' });
      }
      const findQueue = await Queue.findOne({ id });
      if (!findQueue) {
        throw ({ code: `[H][Q][U][ERR002]`, message: 'Queue not found' });
      }
      const queueName = _.get(findQueue, 'name');
      const queueConfig = _.get(findQueue, 'config');
      const queue = Bull(queueName, redisClient, queueConfig);
      queue.obliterate({ force: true });
      let updateParams = {};
      if (name) {
        updateParams = {
          ...updateParams,
          name
        };
      }
      if (status) {
        updateParams = {
          ...updateParams,
          status
        };
      }
      if (config) {
        updateParams = {
          ...updateParams,
          config
        };
      }
      if (job) {
        const findJob = await Job.findOne({ id: job });
        if (!findJob) {
          throw ({ code: `[H][Q][U][ERR003]`, message: 'Job not found' });
        }
        else {
          updateParams = {
            ...updateParams,
            job: _.get(findJob, 'id')
          };
        }
      }
      if (supplier) {
        const findSupplier = await Supplier.findOne({ id: supplier });
        if (!findSupplier) {
          throw ({ code: `[H][Q][U][ERR004]`, message: 'Supplier not found' });
        }
        else {
          updateParams = {
            ...updateParams,
            supplier: _.get(findSupplier, 'id')
          };
        }
      }
      const updateQueue = await Queue.updateOne({ id }).set(updateParams);
      // Emit event to update Bull Board
      sails.emit('queued');
      return exits.success(updateQueue);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][Q][U]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

