import database from '../../database';
import { aNewUser, aTest, anAccessPass } from '../../test/domainFactories';
import { cleanupDatabase } from '../../test/cleanupDatabase';
import { PsqlStatisticRepository } from './PsqlStatisticRepository';

import { testRepository, accessPassRepository, userRepository } from '.';

describe(PsqlStatisticRepository, () => {
  const psqlStatisticRepository = new PsqlStatisticRepository(database);

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('reads the amount of users in the database', async () => {
    expect(await psqlStatisticRepository.getTotalAmountOfUsers()).toBe(0);
    await Promise.all([
      userRepository.save(aNewUser()),
      userRepository.save(aNewUser()),
      userRepository.save(aNewUser()),
    ]);
    expect(await psqlStatisticRepository.getTotalAmountOfUsers()).toBe(3);
    await userRepository.save(aNewUser());
    expect(await psqlStatisticRepository.getTotalAmountOfUsers()).toBe(4);
  });

  it('reads the amount of tests in the database', async () => {
    expect(await psqlStatisticRepository.getTotalAmountOfTests()).toBe(0);
    await Promise.all([testRepository.save(aTest()), testRepository.save(aTest())]);
    expect(await psqlStatisticRepository.getTotalAmountOfTests()).toBe(2);
    await Promise.all([testRepository.save(aTest()), testRepository.save(aTest()), testRepository.save(aTest())]);
    expect(await psqlStatisticRepository.getTotalAmountOfTests()).toBe(5);
  });

  it('reads the amount of access passes in the database', async () => {
    expect(await psqlStatisticRepository.getTotalAmountOfAccessPasses()).toBe(0);
    await Promise.all([
      accessPassRepository.save(anAccessPass()),
      accessPassRepository.save(anAccessPass()),
      accessPassRepository.save(anAccessPass()),
      accessPassRepository.save(anAccessPass()),
    ]);
    expect(await psqlStatisticRepository.getTotalAmountOfAccessPasses()).toBe(4);
    await accessPassRepository.save(anAccessPass());
    expect(await psqlStatisticRepository.getTotalAmountOfAccessPasses()).toBe(5);
  });
});

afterAll(() => {
  return database.destroy();
});
