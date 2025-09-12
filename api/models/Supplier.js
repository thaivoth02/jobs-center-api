/**
 * Category.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const uuid = require('uuid');
const shortHash = require('short-hash');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string',
      required: true,
      description: 'Name of supplier'
    },

    code: {
      type: 'string',
      description: 'Code of supplier'
    },

    status: {
      type: 'number',
      isIn: [0, 1],
      defaultsTo: 0,
      description: 'Status of supplier as [0:active, 1: inactive]'
    },

    urls: {
      type: 'json',
      defaultsTo: '',
      description: 'List of base urls'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    queues:{
      collection: 'Queue',
      via: 'supplier'
    }
  },

  beforeCreate: (model, next) => {
    /** Not to found id of model */
    model.id = uuid.v1();
    model.createdAt = new Date();
    model.updatedAt = new Date();
    /** Not found hash */
    if (!model.code) {
      model.code = shortHash(model.id);
    }
    return next();
  },

  beforeUpdate: (model, next) => {
    model.updatedAt = new Date();
    return next();
  }
};

