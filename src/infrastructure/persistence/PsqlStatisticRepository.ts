import knex from 'knex';
import { StatisticRepostory } from '../../domain/model/statistics/StatisticRepository';

export class PsqlStatisticRepository implements StatisticRepostory {
  constructor(private db: knex) {}

  getTotalAmountOfUsers(): Promise<number> {
    return this.db('user').count();
  }

  getTotalAmountOfTests(): Promise<number> {
    return this.db('test').count();
  }

  getTotalAmountOfAccessPasses(): Promise<number> {
    return this.db('access_pass').count();
  }
}
