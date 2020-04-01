import { CreateTestType } from './CreateTestType';
import { aCreateTestTypeCommand } from '../../../test/apiFactories';
import { testTypeRepository } from '../../../infrastructure/persistence';
import { cleanupDatabase } from '../../../test/cleanupDatabase';
import database from '../../../database';

describe('CreateTestType', () => {
  const createTestType = new CreateTestType(testTypeRepository);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('creates a new test type', async () => {
    const name = 'Name';
    const permission = 'PERMISSION';
    const newTestType = await createTestType.execute(aCreateTestTypeCommand(name, permission));

    const persistedTestTypes = await testTypeRepository.findByPermissions([permission]);

    expect(persistedTestTypes).toEqual([newTestType]);
  });
});

afterAll(() => {
  return database.destroy();
});
