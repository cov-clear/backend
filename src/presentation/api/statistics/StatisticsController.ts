import { Authorized, Get, JsonController, UseBefore } from 'routing-controllers';

import { hasPermission } from '../../middleware/hasPermission';
import { VIEW_STATISTICS } from '../../../domain/model/authentication/Permissions';
import { Statistic } from '../../../domain/model/statistics/Statistic';
import { StatisticDTO } from '../../dtos/statistics/StatisticDTO';
import { getStatistics } from '../../../application/service';

@Authorized()
@JsonController('/v1/statistics')
export class StatisticsController {
  private getStatistics = getStatistics;

  @Get()
  @UseBefore(hasPermission(VIEW_STATISTICS))
  async get(): Promise<StatisticDTO[]> {
    const statistics = await this.getStatistics.getStatistics();
    return statistics.map(statisticToStatisticDTO);
  }
}

function statisticToStatisticDTO(statistic: Statistic): StatisticDTO {
  return {
    label: statistic.label,
    value: statistic.value,
  };
}
