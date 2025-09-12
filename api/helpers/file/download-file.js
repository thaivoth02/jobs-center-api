const fs = require('fs');
const path = require('path');

module.exports = {


  friendlyName: 'Download file',


  description: '',


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
    /** Get configurations */
    const fileConfig = _.get(sails.config.custom, 'file', {});
    const defaultPath = _.get(fileConfig, 'path', 'assets/');
    const excelPath = _.get(fileConfig, 'excelPath', 'documents/excel/');
    const textPath = _.get(fileConfig, 'textPath', 'documents/text/');
    try {
      const { file } = _.get(inputs, 'data', {});
      let fileDirectory = defaultPath;
      if (file.endsWith('xlsx')) {
        fileDirectory = path.join(fileDirectory, excelPath);
      } else if (file.endsWith('txt')) {
        fileDirectory = path.join(fileDirectory, textPath);
      }

      const filePath = path.join(fileDirectory, file);
      const fileExist = fs.existsSync(filePath);
      if (!fileExist) {
        throw ({
          code: '[H][F][DF][ERR001]',
          message: 'File not found'
        });
      }
      const buffer = fs.readFileSync(filePath);
      return exits.success(buffer);
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][F][DF]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

