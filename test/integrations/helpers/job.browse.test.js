describe('Helpers.job', () => {
  describe('#browse()', () => {
    it('Data browse job', async () => {
      try {
        const data = await sails.helpers.job.browse.with({
          data: {
            id: '59103b50-3152-11ef-9e53-a9ce41eb2ab2',
            status: 0
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
  describe('#browse()', () => {
    it('Browse job', async () => {
      try {
        const data = await sails.helpers.job.browse.with({
          data: {}
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
