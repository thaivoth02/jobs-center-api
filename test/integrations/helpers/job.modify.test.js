describe('Helpers.job', () => {
  describe('#modify()', () => {
    it('Data modify job', async () => {
      try {
        const data = await sails.helpers.job.modify.with({
          data: {
            id: '4b6287f0-31a8-11ef-aeff-17d945ae67fc',
            config: {
              repeat: {
                cron: '45 9 * * *'
              }
            },
            queues: [
              'mt'
            ]
          }
        }).timeout(100000);
        if (_.isEmpty(data)) {
          throw new Error('JobCenter data failed.');
        }
        console.log(`Have response: ${JSON.stringify(data)}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        throw error;
      }
    });
  });
});
