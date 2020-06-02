import { Statistic } from '../../../domain/model/statistics/Statistic';
import { UserRepository } from '../../../domain/model/user/UserRepository';
import { TestRepository } from '../../../domain/model/test/TestRepository';
import { AccessPassRepository } from '../../../domain/model/accessPass/AccessPassRepository';

export class GetStatistics {
  constructor(
    private userRepository: UserRepository,
    private testRepository: TestRepository,
    private accessPassRepository: AccessPassRepository
  ) {}

  public async execute(): Promise<Statistic[]> {
    return Promise.all([this.getUsersStatistic(), this.getTestsStatistic(), this.getAccessPassesStatistic()]);
  }

  private async getUsersStatistic(): Promise<Statistic> {
    const value = await this.userRepository.getTotalAmountOfUsers();
    return new Statistic('Users', value);
  }

  private async getTestsStatistic(): Promise<Statistic> {
    const value = await this.testRepository.getTotalAmountOfTests();
    return new Statistic('Tests', value);
  }

  private async getAccessPassesStatistic(): Promise<Statistic> {
    const value = await this.accessPassRepository.getTotalAmountOfAccessPasses();
    return new Statistic('Access passes', value);
  }
}
