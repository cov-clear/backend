import { getCountries } from '../../../application/service';
import { Authorized, Get, JsonController } from 'routing-controllers';

@Authorized()
@JsonController('/v1')
export class CountryController {
  private getCountries = getCountries;

  @Get('/countries')
  async getAllCountries() {
    return getCountries.execute();
  }
}
