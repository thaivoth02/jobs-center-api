module.exports = {

  friendlyName: 'List configuration',

  description: '',

  inputs: {
    data: {
      type: 'ref'
    }
  },
  exist: {
    success: {
      description: 'All done',
      responseType: 'all done',
    }
  },


  fn: async function (inputs, exits) {
    // TODO
    const queueData = _.get(sails.config, 'queue', {}) || {};
    return exits.success({
      data: queueData,
      message: 'Get configuration successfully'
    });
  }
};

