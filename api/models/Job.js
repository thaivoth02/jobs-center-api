/**
 * Category.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const uuid = require('uuid');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    config: {
      type: 'json',
      description: 'Configuration of job'
    },

    value: {
      type: 'json',
      description: 'Value of job'
    },

    status: {
      type: 'number',
      isIn: [0, 1, 2],
      defaultsTo: 0,
      description: 'Status of job as [0: active, 1: completed, 2: failed]'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    queues:{
      collection:'queue',
      via: 'job',
      through: 'Log'
    }
  },

  beforeCreate: (model, next) => {
    /** Not to found id of model */
    model.id = uuid.v1();
    model.createdAt = new Date();
    model.updatedAt = new Date();
    return next();
  },

  beforeUpdate: (model, next) => {
    model.updatedAt = new Date();
    return next();
  }
};

