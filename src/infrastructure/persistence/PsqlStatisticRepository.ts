import knex from 'knex';
import { StatisticRepostory } from '../../domain/model/statistics/StatisticRepository';

export class PsqlStatisticRepository implements StatisticRepostory {
  constructor(private db: knex) {}

  getTotalAmountOfUsers(): Promise<number> {
    return this.count('user');
  }

  getTotalAmountOfTests(): Promise<number> {
    return this.count('test');
  }

  getTotalAmountOfAccessPasses(): Promise<number> {
    return this.count('access_pass');
  }

  private async count(table: string): Promise<number> {
    const results: { count: string }[] = await this.db(table).count();
    if (!results || !results.length) {
      return 0;
    }
    return parseInt(results[0].count, 10);
  }
}
