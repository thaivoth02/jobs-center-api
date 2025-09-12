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
      const { name, code, status, config, job, supplier } = _.get(inputs, 'data');
      let createParams = {
        id: 'newQueue',
        status: 0
      };
      if (!name) {
        throw ({ code: `[H][Q][C][ERR001]`, message: 'Name is required' });
      }
      if (!code) {
        throw ({ code: `[H][Q][C][ERR002]`, message: 'Code is required' });
      }
      const findQueue = await Queue.findOne({ name });
      if (findQueue) {
        throw ({ code: `[H][Q][C][ERR003]`, message: 'Name is exists' });
      }
      createParams = {
        ...createParams,
        name,
        code
      };
      if (status) {
        createParams = {
          ...createParams,
          status
        };
      }
      if (config) {
        createParams = {
          ...createParams,
          config
        };
      }
      if (job) {
        const findJob = await Job.findOne({ code: job });
        if (!findJob) {
          throw ({ code: `[H][Q][C][ERR004]`, message: 'Job not found' });
        }
        else {
          createParams = {
            ...createParams,
            job: _.get(findJob, 'id')
          };
        }
      }
      if (supplier) {
        const findSupplier = await Supplier.findOne({ code: supplier });
        if (!findSupplier) {
          throw ({ code: `[H][Q][C][ERR005]`, message: 'Supplier not found' });
        }
        else {
          createParams = {
            ...createParams,
            supplier: _.get(findSupplier, 'id')
          };
        }
      }
      const createQueue = await Queue.create(createParams).fetch();
      // Emit event to update Bull Board
      sails.emit('queued');
      return exits.success(createQueue);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][Q][C]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

