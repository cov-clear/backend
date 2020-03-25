import database from '.';

describe('database connector', () => {
  it('connects to the database', async () => {
    expect(
      await database.schema.hasTable('some-table-that-does-not-exist')
    ).toBe(false);
  });
});

afterAll((done) => {
  database.destroy().then(done);
});
