import http, { AxiosInstance } from 'axios';
import * as config from '../../config';

export interface DokobitAuthenticationRequest {
  returnUrl: string;
}

export interface DokobitAuthenticationResponse {
  sessionToken: string;
  url: string;
}

export interface DokobitSessionStatus {
  code: string;
  name: string;
  surname: string;
  countryCode: string;
}

export class DokobitClient {
  private http: AxiosInstance;

  constructor() {
    this.http = http.create({
      baseURL: config.get('authentication.dokobit.baseUrl'),
    });
  }

  async createSession(request: DokobitAuthenticationRequest): Promise<DokobitAuthenticationResponse> {
    const response = await this.http.post(
      '/api/authentication/create',
      {
        return_url: request.returnUrl,
      },
      this.authenticatedParams()
    );
    return {
      sessionToken: response.data.session_token,
      url: response.data.url,
    };
  }

  async getSessionStatus(sessionToken: string): Promise<DokobitSessionStatus> {
    const response = await this.http.get(`/api/authentication/${sessionToken}/status`, this.authenticatedParams());

    return {
      code: response.data.code,
      name: response.data.name,
      surname: response.data.surname,
      countryCode: response.data.country_code,
    };
  }

  private authenticatedParams() {
    return {
      params: {
        access_token: config.get('authentication.dokobit.accessToken'),
      },
    };
  }
}
