module.exports = {


  friendlyName: 'Update',


  description: 'Update job.',


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
      /** Get data */
      const { id, value, config, queues } = _.get(inputs, 'data');
      if (!id) {
        throw ({ code: `[H][J][U][ERR001]`, message: 'Id is required' });
      }
      const findJob = await Job.findOne({ id }).populate('queues');
      if (!findJob) {
        throw ({ code: `[H][J][U][ERR002]`, message: 'Job not found' });
      }
      const jobConfig = _.get(findJob, 'config', {});
      if (_.isEmpty(jobConfig)) {
        throw ({ code: `[H][J][C][ERR003]`, message: 'Job is not repeatable' });
      }
      let updateParams = {};
      if (config) {
        updateParams = {
          ...updateParams,
          config
        };
      }
      if (value) {
        updateParams = {
          ...updateParams,
          value
        };
      }
      if (_.isEmpty(queues)) {
        await Job.updateOne({ id }).set(updateParams);
      } else {
        let updatedJob = await Job.findOne({ id }).populate('queues');
        /** Get queue */
        queues.forEach(async queue => {
          const queueName = _.get(queue, 'name', '');
          const queueConfig = _.get(queue, 'config', {});
          /** Create queue */
          await sails.helpers.bull.modify({ queueName, queueConfig, job: updatedJob });
        });
      }
      return exits.success(updatedJob);
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

