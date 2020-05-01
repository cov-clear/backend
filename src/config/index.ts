import config from 'config';

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment() {
  return !isProduction();
}

export function get<T>(key: string) {
  return config.get<T>(key);
}
