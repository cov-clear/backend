import { ServiceConfigDTO } from '../../../presentation/dtos/config/ServiceConfigDTO';

export class GetServiceConfig {
  constructor(private config: any) {}

  public async execute(): Promise<ServiceConfigDTO> {
    return {
      allowedAuthMethods: this.config.get('authentication.allowedMethods'),
      defaultLanguage: this.config.get('i18n.defaultLanguage'),
    };
  }
}
