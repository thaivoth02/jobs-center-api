module.exports = {


  friendlyName: 'List queue',


  description: '',


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
    try {
      const { id, status, queue } = _.get(inputs, 'data', {});
      let criteria = {};
      if (id) {
        criteria = {
          ...criteria,
          id,
        };
      }
      if (status) {
        criteria = {
          ...criteria,
          status,
        };
      }
      const findJob = await Job.find(criteria).populate('queues');
      let data = findJob;
      if (queue) {
        data = data.filter((job) => {
          const jobQueue = _.get(job, 'queues', []);
          return jobQueue.some((jobQueue) => jobQueue.code === queue);
        }).map((job) => {
          const jobId = _.get(job, 'id', '');
          const jobValue = _.get(job, 'value', '');
          const jobConfig = _.get(job, 'config', {});
          const jobStatus = _.get(job, 'status', '');
          return {
            id: jobId,
            value: jobValue,
            config: jobConfig,
            status: jobStatus
          };
        });
      }
      return exits.success(data);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][J][L]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

