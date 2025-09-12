const Bull = require('bull');

module.exports = {


  friendlyName: 'Run job',


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
    try {
      /** Create redis client */
      const redisClient = await sails.helpers.redis.createClient();
      /** Get configurations */
      const jobDefaultOptions = _.get(sails.config.custom, 'constants.job.options', {});
      const deletionTime = _.get(sails.config.custom, 'constants.job.deletionTime', 6 * 60 * 60 * 1000) || 6 * 60 * 60 * 1000;
      const jobCode = _.get(sails.config.custom, 'constants.job.code', {});
      const jobStatus = _.get(sails.config.custom, 'constants.job.status', {});
      /** Get data */
      const { queueId, queueCode, queueName, queueConfig } = _.get(inputs, 'data', {});
      const helper = _.get(sails.config.queue, `${queueCode}.helper`);
      const helperDirectories = _.get(helper, 'directories', []);
      const helperName = _.get(helper, 'file', '').split('-').map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('');
      const helperData = _.get(helper, 'data', {});
      let sailsHelper = sails.helpers;
      /** Verify helper */
      helperDirectories.forEach(directory => {
        if (!sailsHelper[directory]) {
          sails.log.warn('Helper directory not found');
        }
        sailsHelper = sailsHelper[directory];
      });
      if (sailsHelper !== sails.helpers) {
        if (!sailsHelper[helperName]) {
          sails.log.warn('Helper not found');
        } else {
          sailsHelper = sailsHelper[helperName];
          /** Create queue */
          const queue = Bull(queueName, redisClient, queueConfig);
          /** Add job */
          const jobs = await sails.helpers.job.browse({ queue: queueCode });
          jobs.forEach(job => {
            const jobId = _.get(job, 'id', '');
            const config = _.get(job, 'config', {});
            const status = _.get(job, 'status', '');
            if (status === jobStatus.active) {
              queue.add({}, {
                ...config,
                ...jobDefaultOptions,
                jobId
              });
            }
          });
          /** Process queue */
          queue.process(async (job) => {
            try {
              const findJob = await sails.models.job.findOne({ id: job.id });
              if (findJob) {
                await job.log('Updating job value...');
                await job.update(_.get(findJob, 'value', {}));
              }

              await job.log('Job started!');
              try {
                const data = await sailsHelper({
                  helperData,
                  queue: { id: queueId, name: queueName },
                  job,
                  redisClient: queue.clients[0]
                });
                const code = _.get(data, 'code', '');
                if (code !== jobCode.COMPLETED) {
                  await sails.models.job.update({ id: job.id }, { status: jobStatus.failed });
                  throw new Error('Job did not complete successfully');
                }

                await sails.models.job.update({ id: job.id }, { status: jobStatus.completed });
                return data;
              } catch (error) {
                await sails.models.job.update({ id: job.id }, { status: jobStatus.failed });
                throw new Error(`Job processing error: ${error.message}`);
              }
            } catch (error) {
              sails.log.error(`Job processing error: ${error.message}`);
              await sails.models.job.updateOne({ id: job.id }, { status: jobStatus.failed });
              throw new Error(`Job processing error: ${error.message}`);
            }
          });

          queue.on('completed', async (job) => {
            try {
              await sails.helpers.log.createLog({
                code: '0',
                log: job.returnvalue.log,
                jobId: job.id,
                queueId,
                redisClient: queue.clients[0]
              });
              await job.log('Job completed');
              setTimeout(async () => {
                try {
                  await job.remove();
                } catch (error) {
                  sails.log.error(`Error removing completed job: ${error.message}`);
                }
              }, deletionTime);
            } catch (error) {
              sails.log.error(`Error logging completed job: ${error.message}`);
            }
          });
          queue.on('failed', async (job, error) => {
            try {
              await sails.helpers.log.createLog({
                code: '1',
                log: {
                  message: _.get(error, 'message', 'Unknown error'),
                },
                jobId: job.id,
                queueId,
                redisClient: queue.clients[0]
              });
              await job.log('Job failed');
              setTimeout(async () => {
                try {
                  await job.remove();
                } catch (removeError) {
                  sails.log.error(`Error removing failed job: ${removeError.message}`);
                }
              }, deletionTime);
            } catch (logError) {
              sails.log.error(`Error logging failed job: ${logError.message}`);
            }
          });
        }
      }
      return exits.success();
    } catch (error) {
      /** Get code */
      const code = _.get(error, 'code') || 'E_UNKNOWN';
      /** Get message from error */
      const message = _.get(error, 'message', 'Unknown error');
      /** Log */
      sails.log.error(`[H][L][CL]: ${message}`);
      throw ({
        code,
        message
      });
    }
  }


};

