module.exports = {


  friendlyName: 'List queue',


  description: '',


  inputs: {
    data: {
      type: 'ref',
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
    const queueConfig = _.get(sails.config.custom, 'constants.queue', {});
    const queueStatus = _.get(queueConfig, 'status', {});
    try {
      const { id, name, code, status } = _.get(inputs, 'data', {});
      let criteria = {};
      if (id) {
        criteria = {
          ...criteria,
          id
        };
      }
      if (name) {
        criteria = {
          ...criteria,
          name: {
            contains: name,
          },
        };
      }
      if (code) {
        criteria = {
          ...criteria,
          code
        };
      }
      if (!isNaN(status)) {
        if (_.includes(_.values(queueStatus), status)) {
          criteria = {
            ...criteria,
            status,
          };
        } else {
          sails.log.warn({ message: 'Status not found' });
        }
      }
      const total = await Queue.count(criteria);
      const listQueue = await Queue.find(criteria);
      return exits.success({
        data: listQueue,
        total,
      });
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][Q][L]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

