describe('Helpers.queue', () => {
  describe('#add()', () => {
    it('Data add queue', async () => {
      try {
        const data = await sails.helpers.queue.add.with({
          data: {
            name: 'Message telephone 3',
            code: 'mt',
            status: 0,
            config: '',
            supplier: 'Mobistore'
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
