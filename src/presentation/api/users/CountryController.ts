import { getCountries } from '../../../application/service';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { Get, JsonController, UseBefore } from 'routing-controllers';

@JsonController('/v1')
@UseBefore(isAuthenticated)
export class CountryController {
  private getCountries = getCountries;

  @Get('/countries')
  async getAllCountries() {
    return getCountries.execute();
  }
}
