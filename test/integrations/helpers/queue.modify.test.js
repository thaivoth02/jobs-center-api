describe('Helpers.queue', () => {
  describe('#modify()', () => {
    it('Data modify queue', async () => {
      try {
        const data = await sails.helpers.queue.modify.with({
          data: {
            id: 'f6a7f090-31a9-11ef-a001-45cf5780466f',
            name: 'Test 1',
            status: 0,
            job: '4e4073d0-3156-11ef-9121-4f15c7c7ca4c',
            config: '',
            supplier: '878cb9f7-db2c-43a5-83cc-5d288e4d83b1'
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
