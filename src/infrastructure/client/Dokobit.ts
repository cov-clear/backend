interface Profile {}

class AuthenticationSessionToken {}

interface AuthenticationSession {
  token: AuthenticationSessionToken;
  redirectUrl: string;
}

interface Authentication {
  identity: Profile;
  countryCode: string;
}

interface AuthenticationProvider {
  createSession(): Promise<AuthenticationSession>;
  authenticate(token: AuthenticationSessionToken): Promise<Authentication>;
}

import http, { AxiosInstance } from 'axios';
import * as config from '../../config';

interface DokobitAuthenticationRequest {
  returnUrl: string;
  countryCode?: string;
}

interface DokobitAuthenticationResponse {
  status: string;
  sessionToken: string;
  url: string;
}

interface DokobitSessionStatus {
  status: string;
  code: string;
  name: string;
  surname: string;
  countryCode: string;
}

class DokobitClient {
  private http: AxiosInstance;

  constructor() {
    this.http = http.create({
      baseURL: config.get('authentication.dokobit.baseUrl'),
      params: {
        access_token: config.get('authentication.dokobit.accessToken'),
      },
    });
  }

  async createSession(request: DokobitAuthenticationRequest): Promise<DokobitAuthenticationResponse> {
    const response = await this.http.post('/api/authentication/create', {
      return_url: request.returnUrl,
      country_code: request.countryCode,
    });

    return {
      status: response.data.status,
      sessionToken: response.data.session_token,
      url: response.data.url,
    };
  }

  async getSessionStatus(sessionToken: string): Promise<DokobitSessionStatus> {
    const response = await this.http.get(`/api/authentication/${sessionToken}/status`);

    return {
      status: response.data.status,
      code: response.data.code,
      name: response.data.name,
      surname: response.data.surname,
      countryCode: response.data.country_code,
    };
  }
}

class DokobitAuthenticationProvider implements AuthenticationProvider {
  constructor(private client: DokobitClient) {}

  async createSession(): Promise<AuthenticationSession> {
    const returnUrl = `${config.get('frontend.baseUrl')}/`;
    const session = await this.client.createSession({ returnUrl });
    // check if oki
    return {
      token: session.sessionToken,
      redirectUrl: session.url,
    };
  }

  authenticate(token: AuthenticationSessionToken): Promise<Authentication>;
}
