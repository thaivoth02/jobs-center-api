// api/hooks/BullBoardHook.js

const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const Bull = require('bull');
const redis = require('redis');

const updateBullDashboard = async (redisServer, serverAdapter) => {
  const Queue = sails.models.queue;
  const findQueues = await Queue.find().populate('supplier');
  const queues = findQueues.map((queue) => queue.name);
  const bullQueues = queues.map((qs) => new Bull(qs, redisServer)).map((q) => new BullAdapter(q));
  createBullBoard({
    queues: bullQueues,
    serverAdapter,
    options: {
      uiConfig: {
        boardTitle: 'Jobs Center',
        boardLogo: {
          path: 'https://www.reshot.com/preview-assets/icons/8GJ7ED4K6U/bull-8GJ7ED4K6U.svg',
          width: 30,
          height: 30,
        }
      }
    }
  });
  findQueues.forEach(async (queue) => {
    const queueCode = _.get(queue, 'code', '');
    const queueId = _.get(queue, 'id', '');
    const queueName = _.get(queue, 'name', '');
    const queueConfig = _.get(queue, 'config', {});
    await sails.helpers.queue.runJob({
      queueId,
      queueCode,
      queueName,
      queueConfig,
    });
  });
};

module.exports = function defineBullBoardHook(sails) {
  const redisServer = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    },
  });
  return {
    initialize: async function () {
      const queueList = [];
      const expressApp = sails.hooks.http.app;
      const serverAdapter = new ExpressAdapter();
      serverAdapter.setBasePath('/');
      const queues = queueList
        .map((qs) => new Bull(qs, redisServer))
        .map((q) => new BullAdapter(q));
      // Create Bull Board UI
      createBullBoard({
        queues,
        serverAdapter,
        options: {
          uiConfig: {
            boardTitle: 'Jobs Center',
            boardLogo: {
              path: 'https://www.reshot.com/preview-assets/icons/8GJ7ED4K6U/bull-8GJ7ED4K6U.svg',
              width: 30,
              height: 30,
            }
          }
        }
      });
      expressApp.use('/', serverAdapter.getRouter());
      sails.on('lifted', async () => {
        try {
          await updateBullDashboard(redisServer, serverAdapter);
        } catch (error) {
          sails.log.error('Error updating Bull Board:', error);
        }
      });
      // Listen for custom event 'queueCreated' to update Bull Board
      sails.on('queued', async () => {
        try {
          await updateBullDashboard(redisServer, serverAdapter);
        } catch (error) {
          sails.log.error('Error updating Bull Board:', error);
        }
      });
    }
  };
};
