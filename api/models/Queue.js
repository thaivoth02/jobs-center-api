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
    name: {
      type: 'string',
      required: true,
      description: 'Name of queue'
    },

    code: {
      type: 'string',
      required: true,
      description: 'Code of queue'
    },

    status: {
      type: 'number',
      isIn: [0, 1],
      defaultsTo: 0,
      description: 'Status of queue as [0:active, 1: inactive]'
    },

    config: {
      type: 'json',
      description: 'Configuration of queue'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    jobs:{
      collection: 'job',
      via: 'queue',
      through: 'log'
    },

    supplier:{
      model: 'Supplier'
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

