describe('Helpers.queue', () => {
  describe('#getConfiguration()', () => {
    it('Data get configuration queue', async () => {
      try {
        const data = await sails.helpers.queue.getConfiguration.with({
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
