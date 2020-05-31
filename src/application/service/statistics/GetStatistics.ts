import { Statistic } from '../../../domain/model/statistics/Statistic';
import { StatisticRepostory } from '../../../domain/model/statistics/StatisticRepository';

export class GetStatistics {
  constructor(private statisticRepository: StatisticRepostory) {}

  public async getStatistics(): Promise<Statistic[]> {
    return Promise.all([this.getUsersStatistic(), this.getTestsStatistic(), this.getAccessPassesStatistic()]);
  }

  private async getUsersStatistic(): Promise<Statistic> {
    const value = await this.statisticRepository.getTotalAmountOfUsers();
    return new Statistic('Users', value);
  }

  private async getTestsStatistic(): Promise<Statistic> {
    const value = await this.statisticRepository.getTotalAmountOfTests();
    return new Statistic('Tests', value);
  }

  private async getAccessPassesStatistic(): Promise<Statistic> {
    const value = await this.statisticRepository.getTotalAmountOfAccessPasses();
    return new Statistic('Access passes', value);
  }
}
