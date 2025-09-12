module.exports = {


  friendlyName: 'Login',


  description: 'Login authentication.',


  inputs: {
    data: {
      type: 'ref',
      required: true,
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
      /** Get data */
      const { defaultInstance, url, username, password } = _.get(inputs, 'data', {});
      if (!defaultInstance) {
        throw ({
          code: `[H][A][L]`,
          message: 'defaultInstance is required'
        });
      }
      if (!url) {
        throw ({
          code: `[H][A][L]`,
          message: 'Url is required'
        });
      }
      if (!username) {
        throw ({
          code: `[H][A][L]`,
          message: 'username is required'
        });
      }
      if (!password) {
        throw ({
          code: `[H][A][L]`,
          message: 'password is required'
        });
      }
      let newToken;
      await defaultInstance.post(url, {
        username,
        password
      }).then(response => {
        newToken = _.get(response, 'data.data.accessToken.id', '');
      });
      return exits.success(newToken);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][A][GNT]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

