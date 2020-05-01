import { Get, JsonController } from 'routing-controllers';

@JsonController('/v1')
export class HealthController {
  @Get('/health')
  async health() {
    return { status: 'ok' };
  }
}
