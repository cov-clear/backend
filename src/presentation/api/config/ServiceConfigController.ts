import { getServiceConfig } from '../../../application/service';
import { Get, JsonController } from 'routing-controllers';

@JsonController('/v1/config')
export class ServiceConfigController {
  @Get('/')
  async getConfig() {
    return await getServiceConfig.execute();
  }
}
