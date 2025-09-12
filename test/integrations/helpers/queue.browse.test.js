describe('Helpers.queue', () => {
  describe('#browse()', () => {
    it('Data browse queue', async () => {
      try {
        const data = await sails.helpers.queue.browse.with({
          data: {
            // id: '',
            // name: 'Message telephone 3',
            // code: 'mt',
            // status: 0,
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
