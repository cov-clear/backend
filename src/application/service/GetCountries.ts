import countries from 'country-list';
import { Country } from '../../domain/model/user/Country';

export class GetCountries {
  execute(): Array<Country> {
    return countries.getData();
  }
}
