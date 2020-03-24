import config from 'config';

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = !isProduction;

export function get<T>(key: string) {
  return config.get<T>(key);
}
